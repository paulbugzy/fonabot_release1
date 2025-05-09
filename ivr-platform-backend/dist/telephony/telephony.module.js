"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelephonyModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const twilio_service_1 = require("./twilio.service");
const call_execution_service_1 = require("./services/call-execution.service");
const asr_service_1 = require("./services/asr.service");
const fonabot_events_gateway_1 = require("./gateways/fonabot-events.gateway");
const nlu_service_1 = require("./services/nlu.service");
const telephony_controller_1 = require("./telephony.controller");
const credentials_module_1 = require("../credentials/credentials.module");
const phone_number_entity_1 = require("../entities/phone-number.entity");
const call_session_entity_1 = require("../entities/call-session.entity");
const call_log_entity_1 = require("../entities/call-log.entity");
const call_log_event_entity_1 = require("../entities/call-log-event.entity");
const ivr_flow_entity_1 = require("../entities/ivr-flow.entity");
const ivr_flow_node_entity_1 = require("../entities/ivr-flow-node.entity");
const ivr_flow_edge_entity_1 = require("../entities/ivr-flow-edge.entity");
const tts_service_1 = require("./services/tts.service");
const jwt_1 = require("@nestjs/jwt");
let TelephonyModule = class TelephonyModule {
};
exports.TelephonyModule = TelephonyModule;
exports.TelephonyModule = TelephonyModule = __decorate([
    (0, common_1.Module)({
        imports: [
            credentials_module_1.CredentialsModule,
            axios_1.HttpModule,
            typeorm_1.TypeOrmModule.forFeature([
                phone_number_entity_1.PhoneNumber,
                call_session_entity_1.CallSession,
                call_log_entity_1.CallLog,
                call_log_event_entity_1.CallLogEvent,
                ivr_flow_entity_1.IvrFlow,
                ivr_flow_node_entity_1.IvrFlowNode,
                ivr_flow_edge_entity_1.IvrFlowEdge
            ]),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'cd508c706ce02323501b89fb64b2dc6ebf672d5d8150b399c5f6155c58b85bc8',
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
            }),
        ],
        providers: [
            fonabot_events_gateway_1.FonaBotEventsGateway,
            twilio_service_1.TwilioTelephonyService,
            call_execution_service_1.CallExecutionService,
            tts_service_1.TTSService,
            asr_service_1.ASRService,
            nlu_service_1.NLUService,
        ],
        controllers: [telephony_controller_1.TelephonyController],
        exports: [call_execution_service_1.CallExecutionService, twilio_service_1.TwilioTelephonyService, tts_service_1.TTSService, asr_service_1.ASRService, nlu_service_1.NLUService],
    })
], TelephonyModule);
//# sourceMappingURL=telephony.module.js.map