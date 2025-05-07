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
class MakeTestCallDto {
}
let TelephonyController = class TelephonyController {
    constructor(telephonyService) {
        this.telephonyService = telephonyService;
    }
    async makeTestCall(userId, dto) {
        const callSid = await this.telephonyService.makeTestCall(userId, dto.phoneNumber, dto.message);
        return { callSid };
    }
};
exports.TelephonyController = TelephonyController;
__decorate([
    (0, common_1.Post)('test-call'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, MakeTestCallDto]),
    __metadata("design:returntype", Promise)
], TelephonyController.prototype, "makeTestCall", null);
exports.TelephonyController = TelephonyController = __decorate([
    (0, common_1.Controller)('telephony'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [twilio_service_1.TwilioTelephonyService])
], TelephonyController);
//# sourceMappingURL=telephony.controller.js.map