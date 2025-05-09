import { CredentialsService } from '../../credentials/credentials.service';
export interface NLUConfig {
    projectId: string;
    sessionId: string;
    languageCode?: string;
    contexts?: string[];
}
export declare class NLUService {
    private credentialsService;
    private readonly logger;
    constructor(credentialsService: CredentialsService);
    processUtterance(text: string, nluConfig: NLUConfig, userId: string, serviceName: string): Promise<{
        intent: string;
        confidence: number;
        parameters: Record<string, any>;
        fulfillmentText: string;
    }>;
}
