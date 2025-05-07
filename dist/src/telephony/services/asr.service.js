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
var ASRService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ASRService = void 0;
const common_1 = require("@nestjs/common");
const speech_1 = require("@google-cloud/speech");
const credentials_service_1 = require("../../credentials/credentials.service");
let ASRService = ASRService_1 = class ASRService {
    constructor(credentialsService) {
        this.credentialsService = credentialsService;
        this.logger = new common_1.Logger(ASRService_1.name);
    }
    async recognizeSpeech(audioUrl, asrConfig, userId, serviceName) {
        try {
            const credentials = await this.credentialsService.getCredentials(userId, serviceName);
            const client = new speech_1.SpeechClient({ credentials });
            const [response] = await client.recognize({
                audio: { uri: audioUrl },
                config: {
                    languageCode: asrConfig.languageCode || 'en-US',
                    model: asrConfig.model || 'phone_call',
                    speechContexts: asrConfig.hints ? [{
                            phrases: asrConfig.hints
                        }] : undefined,
                    profanityFilter: asrConfig.profanityFilter ?? true,
                },
            });
            const result = response.results[0];
            if (!result?.alternatives[0]) {
                throw new Error('No speech recognition result');
            }
            return {
                transcript: result.alternatives[0].transcript,
                confidence: result.alternatives[0].confidence || 0,
            };
        }
        catch (error) {
            this.logger.error(`Failed to recognize speech: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.ASRService = ASRService;
exports.ASRService = ASRService = ASRService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof credentials_service_1.CredentialsService !== "undefined" && credentials_service_1.CredentialsService) === "function" ? _a : Object])
], ASRService);
//# sourceMappingURL=asr.service.js.map