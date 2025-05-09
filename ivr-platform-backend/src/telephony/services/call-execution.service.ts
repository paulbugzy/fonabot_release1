import { Injectable, Logger, NotFoundException, Inject } from '@nestjs/common'; // Add Inject if using CacheManager
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { twiml } from 'twilio';
import { ASRService } from './asr.service';
import { RedisService } from '../../redis/redis.service';
import { NLUService } from './nlu.service';
import { FonaBotEventsGateway } from '../gateways/fonabot-events.gateway';
import { CallSession } from '../../entities/call-session.entity';
import { IvrFlow } from '../../entities/ivr-flow.entity';
import { IvrFlowNode } from '../../entities/ivr-flow-node.entity';
import { CallLogEvent } from '../../entities/call-log-event.entity';
import { CredentialsService } from '../../credentials/credentials.service';
import { HttpService } from '@nestjs/axios'; // Import HttpService
import { Cache } from 'cache-manager'; // Import Cache type if using CacheManager directly
import { CACHE_MANAGER } from '@nestjs/cache-manager'; // Import CACHE_MANAGER token
import * as _ from 'lodash'; 

@Injectable()
export class CallExecutionService {
  private readonly logger = new Logger(CallExecutionService.name);

constructor(
  @InjectRepository(CallSession) private readonly callSessionRepository: Repository<CallSession>,
  @InjectRepository(IvrFlow) private readonly ivrFlowRepository: Repository<IvrFlow>, // Defined only ONCE
  @InjectRepository(CallLogEvent) private readonly callLogEventRepository: Repository<CallLogEvent>,
  private readonly httpService: HttpService, // Correct injection
  private readonly credentialsService: CredentialsService, // Correct injection (ensure imported/provided)
  private readonly eventsGateway: FonaBotEventsGateway, // Ensure imported/provided
  private readonly redisService: RedisService, // Ensure imported/provided
  private readonly asrService: ASRService, // Ensure imported/provided
  private readonly nluService: NLUService, // Ensure imported/provided
  // OR if using standard Cache Manager instead of custom RedisService:
  // @Inject(CACHE_MANAGER) private cacheManager: Cache,
) {}

// Change the return type and value
  async processExternalASR(callSid: string, recordingUrl: string): Promise<{ transcript: string; confidence: number }> {
     this.logger.warn(`processExternalASR called for ${callSid}, but not implemented. Recording: ${recordingUrl}`);
   // TODO: Implement actual external ASR logic here
   // For now, return placeholder object:
     return { transcript: 'Placeholder ASR result', confidence: 0.9 };
  }
  
  async updateSessionVariables(callSid: string, updates: Record<string, any>): Promise<void> {
    let session = await this.redisService.getCallSession(callSid);

    if (!session) {
      session = await this.callSessionRepository.findOne({ where: { providerCallSid: callSid } });
      if (!session) {
        throw new NotFoundException(`Call session not found for SID: ${callSid}`);
      }
    }

    session.variables = { ...session.variables, ...updates };
    session.lastActivityTime = new Date(); // Update last activity

    await this.callSessionRepository.save(session);
    await this.redisService.setCallSession(callSid, session); // Update Redis as well
  }
  
  async executeStep(callSid: string): Promise<string> {
    // Try Redis first
    let session = await this.redisService.getCallSession(callSid);
    
    // Fall back to database if not in Redis
    if (!session) {
      session = await this.callSessionRepository.findOne({
      where: { providerCallSid: callSid },
      relations: ['ivrFlow'],
    });
      
      if (session) {
        // Cache the session in Redis
        await this.redisService.setCallSession(callSid, session);
      }
    }

    if (!session) {
      throw new NotFoundException(`Call session not found for SID: ${callSid}`);
    }

    const flow = await this.ivrFlowRepository.findOne({
      where: { id: session.ivrFlowId },
      relations: ['nodes', 'edges'],
    });

    const currentNode = flow.nodes.find(
      (node) => node.nodeClientId === session.currentNodeClientId,
    );

    if (!currentNode) {
      throw new NotFoundException('Current node not found in flow');
    }

    await this.logNodeEntry(session, currentNode);

    return this.executeNode(session, flow, currentNode);
  }

  private async executeNode(
    session: CallSession,
    flow: IvrFlow,
    node: IvrFlowNode,
  ): Promise<string> {
    const response = new twiml.VoiceResponse();

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
    } catch (error) {
      this.logger.error(`Error executing node ${node.nodeClientId}`, error);
      response.say('An error occurred processing your call.');
      response.hangup();
      return response.toString();
    }
  }

  private async handleStartNode(
    session: CallSession,
    flow: IvrFlow,
    node: IvrFlowNode,
    response: any,
  ): Promise<string> {
    const nextNode = this.findNextNode(flow, node);
    if (!nextNode) {
      throw new Error('No next node found after Start node');
    }

    await this.updateSessionNextNode(session, nextNode);
    return this.executeNode(session, flow, nextNode);
  }

  private async handlePlayMessageNode(
    session: CallSession,
    flow: IvrFlow,
    node: IvrFlowNode,
    response: any,
  ): Promise<string> {
    const { message, voice } = node.properties;
    const nextNode = this.findNextNode(flow, node);

    response.say(message);

    if (nextNode) {
      await this.updateSessionNextNode(session, nextNode);
      response.redirect({
        method: 'POST',
      }, `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}`);
    } else {
      response.hangup();
      await this.completeSession(session);
    }

    return response.toString();
  }

  private async handleHangupNode(
    session: CallSession,
    flow: IvrFlow,
    node: IvrFlowNode,
    response: any,
  ): Promise<string> {
    if (node.properties?.message) {
      response.say(node.properties.message);
    }
    response.hangup();

    await this.completeSession(session);
    return response.toString();
  }

  private async handleGetInputNode(
    session: CallSession,
    flow: IvrFlow,
    node: IvrFlowNode,
    response: any,
  ): Promise<string> {
    const {
      prompt,
      inputType = 'dtmf',
      asr_service_name,
      asr_config = {},
      timeout = 5,
      numDigits,
      language = 'en-US',
      speechHints = [],
    } = node.properties;

    const useExternalASR = inputType === 'speech' && asr_service_name;

    if (useExternalASR) {
      // Use <Record> for external ASR
      response.say(prompt);
      response.record({
        action: `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}&nodeId=${node.nodeClientId}&useASR=true`,
        method: 'POST',
        maxLength: 10,
        timeout: timeout,
        playBeep: true,
      });
    } else {
      // Use Twilio's built-in speech recognition
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

    // Add a fallback if no input is received
    response.redirect({
      method: 'POST',
    }, `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}&nodeId=${node.nodeClientId}&timeout=true`);

    return response.toString();
  }

  private async handleConditionNode(
    session: CallSession,
    flow: IvrFlow,
    node: IvrFlowNode,
    response: any,
  ): Promise<string> {
    const { conditions = [] } = node.properties;
    let nextNode: IvrFlowNode | null = null;

    // Evaluate conditions
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
        const edge = flow.edges.find(
          (e) =>
            e.sourceNodeClientId === node.nodeClientId &&
            e.sourceHandle === `condition_${condition.id}`,
        );
        if (edge) {
          nextNode = flow.nodes.find((n) => n.nodeClientId === edge.targetNodeClientId);
          break;
        }
      }
    }

    // If no condition matched, use default path
    if (!nextNode) {
      const defaultEdge = flow.edges.find(
        (e) =>
          e.sourceNodeClientId === node.nodeClientId &&
          e.sourceHandle === 'default',
      );
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

  private async handleTransferNode(
    session: CallSession,
    flow: IvrFlow,
    node: IvrFlowNode,
    response: any,
  ): Promise<string> {
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

  private async handleWebhookNode(
    session: CallSession,
    flow: IvrFlow,
    node: IvrFlowNode,
    response: any,
  ): Promise<string> {
    const { url, method, headers = {}, body = {} } = node.properties;

    try {
      // Replace variables in URL, headers, and body
      const processedUrl = this.replaceVariables(url, session.variables);
      const processedHeaders = this.processTemplate(headers, session.variables);
      const processedBody = this.processTemplate(body, session.variables);

      const httpResponse = await this.httpService.request({
        method,
        url: processedUrl,
        headers: processedHeaders,
        data: processedBody,
      }).toPromise();

      // Store response data in variables if specified
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
    } catch (error) {
      await this.logNodeEvent(session, node, 'webhook_error', {
        error: error.message,
      });
      throw error;
    }

    return response.toString();
  }

  private async handleSetVariableNode(
    session: CallSession,
    flow: IvrFlow,
    node: IvrFlowNode,
    response: any,
  ): Promise<string> {
    const { variables = [] } = node.properties;

    const updates: Record<string, any> = {};
    for (const variable of variables) {
      if (variable.expression) {
        updates[variable.name] = this.evaluateExpression(
          variable.expression,
          session.variables,
        );
      } else {
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

  private async handleAIRoutineNode(
    session: CallSession,
    flow: IvrFlow,
    node: IvrFlowNode,
    response: any,
  ): Promise<string> {
    const {
      nlu_service_name,
      nlu_config,
      inputVariables = [],
      outputVariables = [],
    } = node.properties;

    try {
      // Prepare input data from variables
      const inputText = session.variables[inputVariables[0]] || '';

      // Process text through NLU
      const nluResponse = await this.nluService.processUtterance(
        inputText,
        {
          ...nlu_config,
          sessionId: session.providerCallSid,
        },
        session.phoneNumberToRelation?.userId,
        nlu_service_name,
      );

      // Store results in specified output variables
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

      // Find the edge corresponding to the detected intent
      const edge = flow.edges.find(
        (e) =>
          e.sourceNodeClientId === node.nodeClientId &&
          (e.sourceHandle === `intent_${nluResponse.intent}` ||
           e.sourceHandle === 'default')
      );

      const nextNode = edge
        ? flow.nodes.find((n) => n.nodeClientId === edge.targetNodeClientId)
        : null;
      if (nextNode) {
        await this.updateSessionNextNode(session, nextNode);
        response.redirect({
          method: 'POST',
        }, `/telephony/fonabot/ivr-step?CallSid=${session.providerCallSid}`);
      }
    } catch (error) {
      await this.logNodeEvent(session, node, 'ai_routine_error', {
        error: error.message,
      });
      throw error;
    }

    return response.toString();
  }

private replaceVariables(text: string, variables: Record<string, any>): string {
  return text.replace(/\{variables\.([^}]+)\}/g, (match: string, key: string): string => {
    const value = _.get(variables, key, match);
    return String(value ?? match); // Always return a string
  });
}

  private processTemplate(
    template: Record<string, any>,
    variables: Record<string, any>,
  ): Record<string, any> {
    return Object.entries(template).reduce((acc, [key, value]) => {
      acc[key] = typeof value === 'string'
        ? this.replaceVariables(value, variables)
        : value;
      return acc;
    }, {});
  }

  private evaluateExpression(
    expression: string,
    variables: Record<string, any>,
  ): any {
    // Simple arithmetic expression evaluation
    const safeExpression = expression.replace(
      /variables\.([a-zA-Z0-9_]+)/g,
      (match: string, key: string): string => {
        const value = variables[key];
        return typeof value === 'number' ? value.toString() : '0'; // Always return a string
      },
    );

    try {
      return Function(`return ${safeExpression}`)();
    } catch (error) {
      this.logger.error(`Error evaluating expression: ${expression}`, error);
      return null;
    }
  }

  private async logNodeEvent(
    session: CallSession,
    node: IvrFlowNode,
    eventType: string,
    details: Record<string, any>,
  ): Promise<void> {
    await this.callLogEventRepository.save({
      callLogId: session.id,
      nodeClientId: node.nodeClientId,
      nodeType: node.type,
      eventType,
      eventDetails: details,
    });
  }

  private findNextNode(flow: IvrFlow, currentNode: IvrFlowNode): IvrFlowNode | null {
    const edge = flow.edges.find(
      (e) => e.sourceNodeClientId === currentNode.nodeClientId,
    );
    if (!edge) return null;

    return flow.nodes.find((n) => n.nodeClientId === edge.targetNodeClientId);
  }

 async updateSessionNextNode(
  session: CallSession,
  nextNode: IvrFlowNode,
  input?: { type: 'dtmf' | 'speech'; value: string },
): Promise<void> {
  session.currentNodeClientId = nextNode.nodeClientId;
  session.lastActivityTime = new Date();

  const userId = session.phoneNumberToRelation?.userId; // Access userId through the relation

  // Update Redis first for fast access
  await this.redisService.updateCallSession(session.providerCallSid, {
    currentNodeClientId: nextNode.nodeClientId,
    lastActivityTime: session.lastActivityTime,
    variables: session.variables,
    userId: userId, // Add userId to the Redis update if you need it there
  });

  // Emit node change event
  if (userId) {
    this.eventsGateway.emitCallNodeChanged(userId, {
      call_log_id: session.id,
      node_client_id: nextNode.nodeClientId,
      node_type: nextNode.type,
    });
  } else {
    this.logger.warn(`Could not retrieve userId for callSid: ${session.providerCallSid} to emit node change.`);
  }

  if (input) {
    session.variables = {
      ...session.variables,
      last_input_type: input.type,
      last_input: input.value,
    };

    // Emit input received event
    if (userId) {
      this.eventsGateway.emitCallInputReceived(userId, {
        call_log_id: session.id,
        input_type: input.type,
        input_value: input.value,
      });
    } else {
      this.logger.warn(`Could not retrieve userId for callSid: ${session.providerCallSid} to emit input received.`);
    }
  }

  await this.callSessionRepository.save(session);
}

  private async completeSession(session: CallSession): Promise<void> {
    session.status = 'completed';
    session.endTime = new Date();
    
    // Remove from Redis
    await this.redisService.deleteCallSession(session.providerCallSid);
    
    await this.callSessionRepository.save(session);
  }

  private async logNodeEntry(
    session: CallSession,
    node: IvrFlowNode,
  ): Promise<void> {
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
}