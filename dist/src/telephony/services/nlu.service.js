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
var NLUService_1;
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NLUService = void 0;
const common_1 = require("@nestjs/common");
const dialogflow_1 = require("@google-cloud/dialogflow");
const credentials_service_1 = require("../../credentials/credentials.service");
let NLUService = NLUService_1 = class NLUService {
    constructor(credentialsService) {
        this.credentialsService = credentialsService;
        this.logger = new common_1.Logger(NLUService_1.name);
    }
    async processUtterance(text, nluConfig, userId, serviceName) {
        try {
            const credentials = await this.credentialsService.getCredentials(userId, serviceName);
            const client = new dialogflow_1.DialogflowClient({ credentials });
            const [response] = await client.detectIntent({
                session: `projects/${nluConfig.projectId}/agent/sessions/${nluConfig.sessionId}`,
                queryInput: {
                    text: {
                        text,
                        languageCode: nluConfig.languageCode || 'en-US',
                    },
                },
                queryParams: {
                    contexts: nluConfig.contexts?.map(context => ({
                        name: `projects/${nluConfig.projectId}/agent/sessions/${nluConfig.sessionId}/contexts/${context}`,
                        lifespanCount: 5,
                    })),
                },
            });
            const result = response.queryResult;
            if (!result) {
                throw new Error('No NLU result');
            }
            return {
                intent: result.intent?.displayName || 'unknown',
                confidence: result.intentDetectionConfidence || 0,
                parameters: result.parameters?.fields || {},
                fulfillmentText: result.fulfillmentText || '',
            };
        }
        catch (error) {
            this.logger.error(`Failed to process utterance: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.NLUService = NLUService;
exports.NLUService = NLUService = NLUService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof credentials_service_1.CredentialsService !== "undefined" && credentials_service_1.CredentialsService) === "function" ? _a : Object])
], NLUService);
//# sourceMappingURL=nlu.service.js.map