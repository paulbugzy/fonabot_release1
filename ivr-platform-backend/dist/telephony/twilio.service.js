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
var TwilioTelephonyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioTelephonyService = void 0;
const common_1 = require("@nestjs/common");
const twilio_1 = require("twilio");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fonabot_events_gateway_1 = require("./gateways/fonabot-events.gateway");
const redis_service_1 = require("../redis/redis.service");
const credentials_service_1 = require("../credentials/credentials.service");
const phone_number_entity_1 = require("../entities/phone-number.entity");
const call_session_entity_1 = require("../entities/call-session.entity");
const call_log_entity_1 = require("../entities/call-log.entity");
const call_log_event_entity_1 = require("../entities/call-log-event.entity");
let TwilioTelephonyService = TwilioTelephonyService_1 = class TwilioTelephonyService {
    constructor(credentialsService, phoneNumberRepository, callSessionRepository, callLogRepository, callLogEventRepository, eventsGateway, redisService) {
        this.credentialsService = credentialsService;
        this.phoneNumberRepository = phoneNumberRepository;
        this.callSessionRepository = callSessionRepository;
        this.callLogRepository = callLogRepository;
        this.callLogEventRepository = callLogEventRepository;
        this.eventsGateway = eventsGateway;
        this.redisService = redisService;
        this.logger = new common_1.Logger(TwilioTelephonyService_1.name);
    }
    async getTwilioClient(userId) {
        const credentials = await this.credentialsService.getCredentials(userId, 'twilio');
        if (!credentials) {
            throw new Error('No Twilio credentials found');
        }
        return {
            client: new twilio_1.Twilio(credentials.accountSid, credentials.authToken),
            phoneNumber: credentials.phoneNumber,
        };
    }
    async makeCall(userId, to, url) {
        try {
            const { client, phoneNumber } = await this.getTwilioClient(userId);
            const call = await client.calls.create({
                to,
                from: phoneNumber,
                url,
            });
            return call.sid;
        }
        catch (error) {
            this.logger.error('Error making call with Twilio', error);
            throw error;
        }
    }
    async makeTestCall(userId, to, url) {
        try {
            const { client, phoneNumber } = await this.getTwilioClient(userId);
            const call = await client.calls.create({
                to,
                from: phoneNumber,
                url,
            });
            return call.sid;
        }
        catch (error) {
            this.logger.error('Error making test call with Twilio', error);
            throw error;
        }
    }
    async handleIncomingCall(callData) {
        this.logger.log(`Handling incoming call from ${callData.From} to ${callData.To}`);
        try {
            const phoneNumber = await this.phoneNumberRepository.findOne({
                where: { phoneNumber: callData.To },
                relations: ['assignedIvrFlow'],
            });
            if (!phoneNumber || !phoneNumber.assignedIvrFlow) {
                return this.generateDefaultResponse();
            }
            const callSession = await this.callSessionRepository.save({
                providerCallSid: callData.CallSid,
                ivrFlowId: phoneNumber.assignedIvrFlow.id,
                phoneNumberFrom: callData.From,
                phoneNumberTo: callData.To,
                status: 'initiated',
                startTime: new Date(),
                lastActivityTime: new Date(),
                variables: {},
            });
            await this.redisService.setCallSession(callData.CallSid, callSession);
            const callLog = await this.callLogRepository.save({
                providerCallSid: callData.CallSid,
                userId: phoneNumber.userId,
                ivrFlowId: phoneNumber.assignedIvrFlow.id,
                phoneNumberFrom: callData.From,
                phoneNumberTo: callData.To,
                startTime: new Date(),
                status: 'initiated',
            });
            this.eventsGateway.emitCallStarted(phoneNumber.userId, {
                call_log_id: callLog.id,
                provider_call_sid: callData.CallSid,
                phone_number_from: callData.From,
                phone_number_to: callData.To,
                ivr_flow_name: phoneNumber.assignedIvrFlow.name,
            });
            await this.callLogEventRepository.save({
                callLogId: callLog.id,
                eventType: 'call_start',
                eventDetails: {
                    callSid: callData.CallSid,
                    from: callData.From,
                    to: callData.To,
                },
            });
            return this.generateInitialTwiML(phoneNumber.assignedIvrFlow, callData.CallSid);
        }
        catch (error) {
            this.logger.error('Error handling incoming call', error);
            return this.generateErrorResponse();
        }
    }
    generateDefaultResponse() {
        const response = new twilio_1.twiml.VoiceResponse();
        response.say('This number is not configured.');
        response.hangup();
        return response.toString();
    }
    generateErrorResponse() {
        const response = new twilio_1.twiml.VoiceResponse();
        response.say('An error occurred processing your call.');
        response.hangup();
        return response.toString();
    }
    generateInitialTwiML(ivrFlow, callSid) {
        const response = new twilio_1.twiml.VoiceResponse();
        const stepUrl = `/telephony/fonabot/ivr-step?CallSid=${callSid}`;
        response.redirect({ method: 'POST' }, stepUrl);
        return response.toString();
    }
};
exports.TwilioTelephonyService = TwilioTelephonyService;
exports.TwilioTelephonyService = TwilioTelephonyService = TwilioTelephonyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(phone_number_entity_1.PhoneNumber)),
    __param(2, (0, typeorm_1.InjectRepository)(call_session_entity_1.CallSession)),
    __param(3, (0, typeorm_1.InjectRepository)(call_log_entity_1.CallLog)),
    __param(4, (0, typeorm_1.InjectRepository)(call_log_event_entity_1.CallLogEvent)),
    __metadata("design:paramtypes", [credentials_service_1.CredentialsService,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        fonabot_events_gateway_1.FonaBotEventsGateway,
        redis_service_1.RedisService])
], TwilioTelephonyService);
//# sourceMappingURL=twilio.service.js.map