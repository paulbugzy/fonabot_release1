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
var TwilioTelephonyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioTelephonyService = void 0;
const common_1 = require("@nestjs/common");
const twilio_1 = require("twilio");
const credentials_service_1 = require("../credentials/credentials.service");
let TwilioTelephonyService = TwilioTelephonyService_1 = class TwilioTelephonyService {
    constructor(credentialsService) {
        this.credentialsService = credentialsService;
        this.logger = new common_1.Logger(TwilioTelephonyService_1.name);
    }
    async getTwilioClient(userId) {
        const credentials = await this.credentialsService.getCredentials(userId, 'TwilioMain');
        return {
            client: new twilio_1.Twilio(credentials.accountSid, credentials.authToken),
            phoneNumber: credentials.phoneNumber,
        };
    }
    async makeTestCall(userId, toPhoneNumber, message) {
        try {
            const { client, phoneNumber } = await this.getTwilioClient(userId);
            const call = await client.calls.create({
                twiml: `<Response><Say>${message}</Say></Response>`,
                to: toPhoneNumber,
                from: phoneNumber,
            });
            this.logger.log(`Initiated test call: ${call.sid}`);
            return call.sid;
        }
        catch (error) {
            this.logger.error('Failed to make test call', error);
            throw error;
        }
    }
};
exports.TwilioTelephonyService = TwilioTelephonyService;
exports.TwilioTelephonyService = TwilioTelephonyService = TwilioTelephonyService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [credentials_service_1.CredentialsService])
], TwilioTelephonyService);
//# sourceMappingURL=twilio.service.js.map