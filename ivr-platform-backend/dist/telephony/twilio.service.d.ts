import { Repository } from 'typeorm';
import { FonaBotEventsGateway } from './gateways/fonabot-events.gateway';
import { RedisService } from '../redis/redis.service';
import { CredentialsService } from '../credentials/credentials.service';
import { ITelephonyService } from './interfaces/telephony.interface';
import { PhoneNumber } from '../entities/phone-number.entity';
import { CallSession } from '../entities/call-session.entity';
import { CallLog } from '../entities/call-log.entity';
import { CallLogEvent } from '../entities/call-log-event.entity';
import { IncomingCallDto } from './dto/incoming-call.dto';
export declare class TwilioTelephonyService implements ITelephonyService {
    private credentialsService;
    private phoneNumberRepository;
    private callSessionRepository;
    private callLogRepository;
    private callLogEventRepository;
    private eventsGateway;
    private redisService;
    private readonly logger;
    constructor(credentialsService: CredentialsService, phoneNumberRepository: Repository<PhoneNumber>, callSessionRepository: Repository<CallSession>, callLogRepository: Repository<CallLog>, callLogEventRepository: Repository<CallLogEvent>, eventsGateway: FonaBotEventsGateway, redisService: RedisService);
    private getTwilioClient;
    makeCall(userId: string, to: string, url: string): Promise<string>;
    makeTestCall(userId: string, to: string, url: string): Promise<string>;
    handleIncomingCall(callData: IncomingCallDto): Promise<string>;
    private generateDefaultResponse;
    private generateErrorResponse;
    private generateInitialTwiML;
}
