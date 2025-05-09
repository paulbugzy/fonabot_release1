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
var TTSService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTSService = void 0;
const common_1 = require("@nestjs/common");
const text_to_speech_1 = require("@google-cloud/text-to-speech");
const credentials_service_1 = require("../../credentials/credentials.service");
let TTSService = TTSService_1 = class TTSService {
    constructor(credentialsService) {
        this.credentialsService = credentialsService;
        this.logger = new common_1.Logger(TTSService_1.name);
        this.cache = new Map();
    }
    generateCacheKey(text, config) {
        return `${text}:${JSON.stringify(config)}`;
    }
    async synthesizeSpeech(text, ttsConfig, userId, serviceName) {
        const cacheKey = this.generateCacheKey(text, ttsConfig);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }
        try {
            const credentials = await this.credentialsService.getCredentials(userId, serviceName);
            const client = new text_to_speech_1.TextToSpeechClient({ credentials });
            const [response] = await client.synthesizeSpeech({
                input: { text },
                voice: {
                    languageCode: ttsConfig.voice?.languageCode || 'en-US',
                    name: ttsConfig.voice?.name || 'en-US-Standard-A',
                    ssmlGender: ttsConfig.voice?.ssmlGender || 'NEUTRAL',
                },
                audioConfig: {
                    audioEncoding: ttsConfig.audioConfig?.audioEncoding || 'MP3',
                    speakingRate: ttsConfig.audioConfig?.speakingRate || 1.0,
                    pitch: ttsConfig.audioConfig?.pitch || 0,
                    volumeGainDb: ttsConfig.audioConfig?.volumeGainDb || 0,
                },
            });
            const audioUrl = `https://storage.googleapis.com/tts-audio/${cacheKey}.mp3`;
            this.cache.set(cacheKey, audioUrl);
            return audioUrl;
        }
        catch (error) {
            this.logger.error(`Failed to synthesize speech: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.TTSService = TTSService;
exports.TTSService = TTSService = TTSService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [credentials_service_1.CredentialsService])
], TTSService);
//# sourceMappingURL=tts.service.js.map