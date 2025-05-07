import { CredentialsService } from '../../credentials/credentials.service';
export interface ASRConfig {
    languageCode?: string;
    model?: string;
    hints?: string[];
    profanityFilter?: boolean;
    singleUtterance?: boolean;
}
export declare class ASRService {
    private credentialsService;
    private readonly logger;
    constructor(credentialsService: CredentialsService);
    recognizeSpeech(audioUrl: string, asrConfig: ASRConfig, userId: string, serviceName: string): Promise<{
        transcript: string;
        confidence: number;
    }>;
}
