import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { ExternalApiCredential } from '../entities/external-api-credential.entity';
export declare class CredentialsService {
    private credentialsRepository;
    private configService;
    private readonly algorithm;
    private readonly masterKey;
    constructor(credentialsRepository: Repository<ExternalApiCredential>, configService: ConfigService);
    private encrypt;
    private decrypt;
    getCredentials(userId: string, serviceName: string): Promise<any>;
    saveCredentials(userId: string, serviceName: string, credentials: any): Promise<void>;
}
