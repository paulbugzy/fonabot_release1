import { CredentialsService } from '../credentials/credentials.service';
import { ITelephonyService } from './interfaces/telephony.interface';
export declare class TwilioTelephonyService implements ITelephonyService {
    private credentialsService;
    private readonly logger;
    constructor(credentialsService: CredentialsService);
    private getTwilioClient;
    makeTestCall(userId: string, toPhoneNumber: string, message: string): Promise<string>;
}
