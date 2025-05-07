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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelephonyController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const twilio_service_1 = require("./twilio.service");
const call_execution_service_1 = require("./services/call-execution.service");
const incoming_call_dto_1 = require("./dto/incoming-call.dto");
class MakeTestCallDto {
}
let TelephonyController = class TelephonyController {
    constructor(telephonyService, callExecutionService) {
        this.telephonyService = telephonyService;
        this.callExecutionService = callExecutionService;
    }
    async handleIncomingCall(callData) {
        return this.telephonyService.handleIncomingCall(callData);
    }
    async handleIvrStep(callData) {
        let input;
        if (callData.Digits) {
            input = { type: 'dtmf', value: callData.Digits };
        }
        else if (callData.SpeechResult) {
            input = {
                type: 'speech',
                value: callData.SpeechResult,
                confidence: parseFloat(callData.Confidence || '0')
            };
        }
        else if (callData.RecordingUrl && callData.useASR === 'true') {
            const result = await this.callExecutionService.processExternalASR(callData.CallSid, callData.RecordingUrl, callData.nodeId);
            input = {
                type: 'speech',
                value: result.transcript,
                confidence: result.confidence
            };
        }
        return this.callExecutionService.executeStep(callData.CallSid, input);
    }
    async makeTestCall(userId, dto) {
        const callSid = await this.telephonyService.makeTestCall(userId, dto.phoneNumber, dto.message);
        return { callSid };
    }
};
exports.TelephonyController = TelephonyController;
__decorate([
    (0, common_1.Post)('fonabot/incoming/voice'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [incoming_call_dto_1.IncomingCallDto]),
    __metadata("design:returntype", Promise)
], TelephonyController.prototype, "handleIncomingCall", null);
__decorate([
    (0, common_1.Post)('fonabot/ivr-step'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelephonyController.prototype, "handleIvrStep", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('test-call'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, MakeTestCallDto]),
    __metadata("design:returntype", Promise)
], TelephonyController.prototype, "makeTestCall", null);
exports.TelephonyController = TelephonyController = __decorate([
    (0, common_1.Controller)('telephony'),
    __metadata("design:paramtypes", [twilio_service_1.TwilioTelephonyService,
        call_execution_service_1.CallExecutionService])
], TelephonyController);
//# sourceMappingURL=telephony.controller.js.map