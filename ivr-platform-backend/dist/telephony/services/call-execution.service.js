"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CallExecutionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallExecutionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const twilio_1 = require("twilio");
const asr_service_1 = require("./asr.service");
const redis_service_1 = require("../../redis/redis.service");
const nlu_service_1 = require("./nlu.service");
const fonabot_events_gateway_1 = require("../gateways/fonabot-events.gateway");
const call_session_entity_1 = require("../../entities/call-session.entity");
const ivr_flow_entity_1 = require("../../entities/ivr-flow.entity");
const call_log_event_entity_1 = require("../../entities/call-log-event.entity");
const credentials_service_1 = require("../../credentials/credentials.service");
const axios_1 = require("@nestjs/axios");
const _ = require("lodash");
let CallExecutionService = CallExecutionService_1 = class CallExecutionService {
    constructor(callSessionRepository, ivrFlowRepository, callLogEventRepository, httpService, credentialsService, eventsGateway, redisService, asrService, nluService) {
        this.callSessionRepository = callSessionRepository;
        this.ivrFlowRepository = ivrFlowRepository;
        this.callLogEventRepository = callLogEventRepository;
        this.httpService = httpService;
        this.credentialsService = credentialsService;
        this.eventsGateway = eventsGateway;
        this.redisService = redisService;
        this.asrService = asrService;
        this.nluService = nluService;
        this.logger = new common_1.Logger(CallExecutionService_1.name);
    }
    async processExternalASR(callSid, recordingUrl) {
        this.logger.warn(`processExternalASR called for ${callSid}, but not implemented. Recording: ${recordingUrl}`);
        return { transcript: 'Placeholder ASR result', confidence: 0.9 };
    }
    async updateSessionVariables(callSid, updates) {
        let session = await this.redisService.getCallSession(callSid);
        if (!session) {
            session = await this.callSessionRepository.findOne({ where: { providerCallSid: callSid } });
            if (!session) {
                throw new common_1.NotFoundException(`Call session not found for SID: ${callSid}`);
            }
        }
        session.variables = { ...session.variables, ...updates };
        session.lastActivityTime = new Date();
        await this.callSessionRepository.save(session);
        await this.redisService.setCallSession(callSid, session);
    }
    async executeStep(callSid) {
        let session = await this.redisService.getCallSession(callSid);
        if (!session) {
            session = await this.callSessionRepository.findOne({
                where: { providerCallSid: callSid },
                relations: ['ivrFlow'],
            });
            if (session) {
                await this.redisService.setCallSession(callSid, session);
            }
        }
        if (!session) {
            throw new common_1.NotFoundException(`Call session not found for SID: ${callSid}`);
        }
        const flow = await this.ivrFlowRepository.findOne({
            where: { id: session.ivrFlowId },
            relations: ['nodes', 'edges'],
        });
        const currentNode = flow.nodes.find((node) => node.nodeClientId === session.currentNodeClientId);
        if (!currentNode) {
            throw new common_1.NotFoundException('Current node not found in flow');
        }
        await this.logNodeEntry(session, currentNode);
        return this.executeNode(session, flow, currentNode);
    }
    async executeNode(session, flow, node) {
        const response = new twilio_1.twiml.VoiceResponse();
        try {
            switch (node.type) {
                case 'StartNodeFonaBot':
                    return this.handleStartNode(session, flow, node, response);
                case 'PlayMessageNodeFonaBot':
                    return this.handlePlayMessageNode(session, flow, node, response);
                case 'GetInputNodeFonaBot':
                    return this.handleGetInputNode(session, flow, node, response);
                case 'ConditionNodeFonaBot':
                    return this.handleConditionNode(session, flow, node, response);
                case 'HangupNodeFonaBot':
                    return this.handleHangupNode(session, flow, node, response);
                case 'TransferNodeFonaBot':
                    return this.handleTransferNode(session, flow, node, response);
                case 'WebhookNodeFonaBot':
                    return this.handleWebhookNode(session, flow, node, response);
                case 'SetVariableNodeFonaBot':
                    return this.handleSetVariableNode(session, flow, node, response);
                case 'AIRoutineNodeFonaBot':
                    return this.handleAIRoutineNode(session, flow, node, response);
                default:
                    throw new Error(`Unsupported node type: ${node.type}`);
            }
        }
        catch (error) {
            this.logger.error(`Error executing node ${node.nodeClientId}`, error);
            response.say('An error occurred processing your call.');
            response.hangup();
            return response.toString();
        }
    }
    async handleStartNode(session, flow, node, response) {
        const nextNode = this.findNextNode(flow, node);
        if (!nextNode) {
            throw new Error('No next node found after Start node');
        }
        await this.updateSessionNextNode(session, nextNode);
        return this.executeNode(session, flow, nextNode);
    }
    async handlePlayMessageNode(session, flow, node, response) {
        const { message, voice } = node.properties;
        const nextNode = this.findNextNode(flow, node);
        response.say(message);
        if (nextNode) {
            await this.updateSessionNextNode(session, nextNode);
            response.redirect({
                method: 'POST',
            }, `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}`);
        }
        else {
            response.hangup();
            await this.completeSession(session);
        }
        return response.toString();
    }
    async handleHangupNode(session, flow, node, response) {
        if (node.properties?.message) {
            response.say(node.properties.message);
        }
        response.hangup();
        await this.completeSession(session);
        return response.toString();
    }
    async handleGetInputNode(session, flow, node, response) {
        const { prompt, inputType = 'dtmf', asr_service_name, asr_config = {}, timeout = 5, numDigits, language = 'en-US', speechHints = [], } = node.properties;
        const useExternalASR = inputType === 'speech' && asr_service_name;
        if (useExternalASR) {
            response.say(prompt);
            response.record({
                action: `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}&nodeId=${node.nodeClientId}&useASR=true`,
                method: 'POST',
                maxLength: 10,
                timeout: timeout,
                playBeep: true,
            });
        }
        else {
            const gather = response.gather({
                input: inputType === 'speech' ? ['speech'] : ['dtmf'],
                timeout,
                numDigits: inputType === 'dtmf' ? numDigits : undefined,
                language: inputType === 'speech' ? language : undefined,
                hints: inputType === 'speech' ? speechHints.join(' ') : undefined,
                action: `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}&nodeId=${node.nodeClientId}`,
                method: 'POST',
            });
            gather.say(prompt);
        }
        response.redirect({
            method: 'POST',
        }, `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}&nodeId=${node.nodeClientId}&timeout=true`);
        return response.toString();
    }
    async handleConditionNode(session, flow, node, response) {
        const { conditions = [] } = node.properties;
        let nextNode = null;
        for (const condition of conditions) {
            const { variableName, operator, value } = condition;
            const actualValue = session.variables[variableName];
            let conditionMet = false;
            switch (operator) {
                case 'equals':
                    conditionMet = actualValue === value;
                    break;
                case 'contains':
                    conditionMet = actualValue?.includes(value);
                    break;
                case 'greaterThan':
                    conditionMet = Number(actualValue) > Number(value);
                    break;
                case 'lessThan':
                    conditionMet = Number(actualValue) < Number(value);
                    break;
            }
            if (conditionMet) {
                const edge = flow.edges.find((e) => e.sourceNodeClientId === node.nodeClientId &&
                    e.sourceHandle === `condition_${condition.id}`);
                if (edge) {
                    nextNode = flow.nodes.find((n) => n.nodeClientId === edge.targetNodeClientId);
                    break;
                }
            }
        }
        if (!nextNode) {
            const defaultEdge = flow.edges.find((e) => e.sourceNodeClientId === node.nodeClientId &&
                e.sourceHandle === 'default');
            if (defaultEdge) {
                nextNode = flow.nodes.find((n) => n.nodeClientId === defaultEdge.targetNodeClientId);
            }
        }
        if (!nextNode) {
            throw new Error('No valid path found from condition node');
        }
        await this.updateSessionNextNode(session, nextNode);
        return this.executeNode(session, flow, nextNode);
    }
    async handleTransferNode(session, flow, node, response) {
        const { targetNumber, timeout = 30, ringbackTone } = node.properties;
        const dial = response.dial({
            action: `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}&nodeId=${node.nodeClientId}`,
            method: 'POST',
            timeout,
            ringbackTone,
        });
        dial.number(targetNumber);
        await this.logNodeEvent(session, node, 'transfer_initiated', {
            targetNumber,
            timeout,
        });
        return response.toString();
    }
    async handleWebhookNode(session, flow, node, response) {
        const { url, method, headers = {}, body = {} } = node.properties;
        try {
            const processedUrl = this.replaceVariables(url, session.variables);
            const processedHeaders = this.processTemplate(headers, session.variables);
            const processedBody = this.processTemplate(body, session.variables);
            const httpResponse = await this.httpService.request({
                method,
                url: processedUrl,
                headers: processedHeaders,
                data: processedBody,
            }).toPromise();
            if (node.properties.storeResponse) {
                session.variables = {
                    ...session.variables,
                    webhookStatus: httpResponse.status,
                    webhookResponse: httpResponse.data,
                };
                await this.callSessionRepository.save(session);
            }
            await this.logNodeEvent(session, node, 'webhook_success', {
                url: processedUrl,
                status: httpResponse.status,
            });
            const nextNode = this.findNextNode(flow, node);
            if (nextNode) {
                await this.updateSessionNextNode(session, nextNode);
                response.redirect({
                    method: 'POST',
                }, `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}`);
            }
        }
        catch (error) {
            await this.logNodeEvent(session, node, 'webhook_error', {
                error: error.message,
            });
            throw error;
        }
        return response.toString();
    }
    async handleSetVariableNode(session, flow, node, response) {
        const { variables = [] } = node.properties;
        const updates = {};
        for (const variable of variables) {
            if (variable.expression) {
                updates[variable.name] = this.evaluateExpression(variable.expression, session.variables);
            }
            else {
                updates[variable.name] = variable.value;
            }
        }
        session.variables = {
            ...session.variables,
            ...updates,
        };
        await this.callSessionRepository.save(session);
        await this.logNodeEvent(session, node, 'variables_set', { updates });
        const nextNode = this.findNextNode(flow, node);
        if (nextNode) {
            await this.updateSessionNextNode(session, nextNode);
            response.redirect({
                method: 'POST',
            }, `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}`);
        }
        return response.toString();
    }
    async handleAIRoutineNode(session, flow, node, response) {
        const { nlu_service_name, nlu_config, inputVariables = [], outputVariables = [], } = node.properties;
        try {
            const inputText = session.variables[inputVariables[0]] || '';
            const nluResponse = await this.nluService.processUtterance(inputText, {
                ...nlu_config,
                sessionId: session.providerCallSid,
            }, session.phoneNumberToRelation?.userId, nlu_service_name);
            const updates = {
                detected_intent: nluResponse.intent,
                intent_confidence: nluResponse.confidence,
                intent_parameters: nluResponse.parameters,
                fulfillment_text: nluResponse.fulfillmentText,
            };
            session.variables = {
                ...session.variables,
                ...updates,
            };
            await this.callSessionRepository.save(session);
            await this.logNodeEvent(session, node, 'ai_routine_success', {
                service: nlu_service_name,
                updates,
            });
            const edge = flow.edges.find((e) => e.sourceNodeClientId === node.nodeClientId &&
                (e.sourceHandle === `intent_${nluResponse.intent}` ||
                    e.sourceHandle === 'default'));
            const nextNode = edge
                ? flow.nodes.find((n) => n.nodeClientId === edge.targetNodeClientId)
                : null;
            if (nextNode) {
                await this.updateSessionNextNode(session, nextNode);
                response.redirect({
                    method: 'POST',
                }, `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}`);
            }
        }
        catch (error) {
            await this.logNodeEvent(session, node, 'ai_routine_error', {
                error: error.message,
            });
            throw error;
        }
        return response.toString();
    }
    replaceVariables(text, variables) {
        return text.replace(/\{variables\.([^}]+)\}/g, (match, key) => {
            const value = _.get(variables, key, match);
            return String(value ?? match);
        });
    }
    processTemplate(template, variables) {
        return Object.entries(template).reduce((acc, [key, value]) => {
            acc[key] = typeof value === 'string'
                ? this.replaceVariables(value, variables)
                : value;
            return acc;
        }, {});
    }
    evaluateExpression(expression, variables) {
        const safeExpression = expression.replace(/variables\.([a-zA-Z0-9_]+)/g, (match, key) => {
            const value = variables[key];
            return typeof value === 'number' ? value.toString() : '0';
        });
        try {
            return Function(`return ${safeExpression}`)();
        }
        catch (error) {
            this.logger.error(`Error evaluating expression: ${expression}`, error);
            return null;
        }
    }
    async logNodeEvent(session, node, eventType, details) {
        await this.callLogEventRepository.save({
            callLogId: session.id,
            nodeClientId: node.nodeClientId,
            nodeType: node.type,
            eventType,
            eventDetails: details,
        });
    }
    findNextNode(flow, currentNode) {
        const edge = flow.edges.find((e) => e.sourceNodeClientId === currentNode.nodeClientId);
        if (!edge)
            return null;
        return flow.nodes.find((n) => n.nodeClientId === edge.targetNodeClientId);
    }
    async updateSessionNextNode(session, nextNode, input) {
        session.currentNodeClientId = nextNode.nodeClientId;
        session.lastActivityTime = new Date();
        const userId = session.phoneNumberToRelation?.userId;
        await this.redisService.updateCallSession(session.providerCallSid, {
            currentNodeClientId: nextNode.nodeClientId,
            lastActivityTime: session.lastActivityTime,
            variables: session.variables,
            userId: userId,
        });
        if (userId) {
            this.eventsGateway.emitCallNodeChanged(userId, {
                call_log_id: session.id,
                node_client_id: nextNode.nodeClientId,
                node_type: nextNode.type,
            });
        }
        else {
            this.logger.warn(`Could not retrieve userId for callSid: ${session.providerCallSid} to emit node change.`);
        }
        if (input) {
            session.variables = {
                ...session.variables,
                last_input_type: input.type,
                last_input: input.value,
            };
            if (userId) {
                this.eventsGateway.emitCallInputReceived(userId, {
                    call_log_id: session.id,
                    input_type: input.type,
                    input_value: input.value,
                });
            }
            else {
                this.logger.warn(`Could not retrieve userId for callSid: ${session.providerCallSid} to emit input received.`);
            }
        }
        await this.callSessionRepository.save(session);
    }
    async completeSession(session) {
        session.status = 'completed';
        session.endTime = new Date();
        await this.redisService.deleteCallSession(session.providerCallSid);
        await this.callSessionRepository.save(session);
    }
    async logNodeEntry(session, node) {
        await this.callLogEventRepository.save({
            callLogId: session.id,
            nodeClientId: node.nodeClientId,
            nodeType: node.type,
            eventType: 'node_enter',
            eventDetails: {
                properties: node.properties,
            },
        });
    }
};
exports.CallExecutionService = CallExecutionService;
exports.CallExecutionService = CallExecutionService = CallExecutionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(call_session_entity_1.CallSession)),
    __param(1, (0, typeorm_1.InjectRepository)(ivr_flow_entity_1.IvrFlow)),
    __param(2, (0, typeorm_1.InjectRepository)(call_log_event_entity_1.CallLogEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        axios_1.HttpService,
        credentials_service_1.CredentialsService,
        fonabot_events_gateway_1.FonaBotEventsGateway,
        redis_service_1.RedisService,
        asr_service_1.ASRService,
        nlu_service_1.NLUService])
], CallExecutionService);
//# sourceMappingURL=call-execution.service.js.map