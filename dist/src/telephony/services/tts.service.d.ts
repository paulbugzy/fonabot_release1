import { CredentialsService } from '../../credentials/credentials.service';
export interface TTSConfig {
    voice?: {
        languageCode?: string;
        name?: string;
        ssmlGender?: 'NEUTRAL' | 'MALE' | 'FEMALE';
    };
    audioConfig?: {
        audioEncoding?: 'LINEAR16' | 'MP3' | 'OGG_OPUS';
        speakingRate?: number;
        pitch?: number;
        volumeGainDb?: number;
    };
}
export declare class TTSService {
    private credentialsService;
    private readonly logger;
    private readonly cache;
    constructor(credentialsService: CredentialsService);
    private generateCacheKey;
    synthesizeSpeech(text: string, ttsConfig: TTSConfig, userId: string, serviceName: string): Promise<string>;
}
