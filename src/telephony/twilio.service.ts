import { Injectable, Logger } from '@nestjs/common';
import { Twilio, twiml } from 'twilio';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FonaBotEventsGateway } from './gateways/fonabot-events.gateway';
import { RedisService } from '../redis/redis.service';
import { CredentialsService } from '../credentials/credentials.service';
import { ITelephonyService, TelephonyCredentials } from './interfaces/telephony.interface';
import { PhoneNumber } from '../entities/phone-number.entity';
import { CallSession } from '../entities/call-session.entity';
import { CallLog } from '../entities/call-log.entity';
import { CallLogEvent } from '../entities/call-log-event.entity';
import { IncomingCallDto } from './dto/incoming-call.dto';

@Injectable()
export class TwilioTelephonyService implements ITelephonyService {
  private readonly logger = new Logger(TwilioTelephonyService.name);

  constructor(
    private credentialsService: CredentialsService,
    @InjectRepository(PhoneNumber)
    private phoneNumberRepository: Repository<PhoneNumber>,
    @InjectRepository(CallSession)
    private callSessionRepository: Repository<CallSession>,
    @InjectRepository(CallLog)
    private callLogRepository: Repository<CallLog>,
    @InjectRepository(CallLogEvent)
    private callLogEventRepository: Repository<CallLogEvent>,
    private eventsGateway: FonaBotEventsGateway,
    private redisService: RedisService,
  ) {}

  private async getTwilioClient(userId: string): Promise<{ client: Twilio; phoneNumber: string }> {
    const credentials = await this.credentialsService.getCredentials(
      userId,
      'twilio',
    ) as TelephonyCredentials;

    if (!credentials) {
      throw new Error('No Twilio credentials found');
    }

    return {
      client: new Twilio(credentials.accountSid, credentials.authToken),
      phoneNumber: credentials.phoneNumber,
    };
  }

  async makeCall(userId: string, to: string, url: string): Promise<string> {
    try {
      const { client, phoneNumber } = await this.getTwilioClient(userId);

      const call = await client.calls.create({
        to,
        from: phoneNumber,
        url,
      });

      return call.sid;
    } catch (error) {
      this.logger.error('Error making call with Twilio', error);
      throw error;
    }
  }

  async handleIncomingCall(callData: IncomingCallDto): Promise<string> {
    this.logger.log(`Handling incoming call from ${callData.From} to ${callData.To}`);

    try {
      // Look up the phone number configuration
      const phoneNumber = await this.phoneNumberRepository.findOne({
        where: { phoneNumber: callData.To },
        relations: ['assignedIvrFlow'],
      });

      if (!phoneNumber || !phoneNumber.assignedIvrFlow) {
        return this.generateDefaultResponse();
      }

      // Create call session
      const callSession = await this.callSessionRepository.save({
        providerCallSid: callData.CallSid,
        ivrFlowId: phoneNumber.assignedIvrFlow.id,
        phoneNumberFrom: callData.From,
        phoneNumberTo: callData.To,
        status: 'initiated',
        startTime: new Date(),
        lastActivityTime: new Date(),
        variables: {},
      });

      // Cache session in Redis
      await this.redisService.setCallSession(callData.CallSid, callSession);

      // Create call log
      const callLog = await this.callLogRepository.save({
        providerCallSid: callData.CallSid,
        userId: phoneNumber.userId,
        ivrFlowId: phoneNumber.assignedIvrFlow.id,
        phoneNumberFrom: callData.From,
        phoneNumberTo: callData.To,
        startTime: new Date(),
        status: 'initiated',
      });

      // Emit call started event
      this.eventsGateway.emitCallStarted(phoneNumber.userId, {
        call_log_id: callLog.id,
        provider_call_sid: callData.CallSid,
        phone_number_from: callData.From,
        phone_number_to: callData.To,
        ivr_flow_name: phoneNumber.assignedIvrFlow.name,
      });

      // Create initial call log event
      await this.callLogEventRepository.save({
        callLogId: callLog.id,
        eventType: 'call_start',
        eventDetails: {
          callSid: callData.CallSid,
          from: callData.From,
          to: callData.To,
        },
      });

      // Generate initial TwiML response
      return this.generateInitialTwiML(phoneNumber.assignedIvrFlow);

    } catch (error) {
      this.logger.error('Error handling incoming call', error);
      return this.generateErrorResponse();
    }
  }

  private generateDefaultResponse(): string {
    const response = new twiml.VoiceResponse();
    response.say('This number is not configured.');
    response.hangup();
    return response.toString();
  }

  private generateErrorResponse(): string {
    const response = new twiml.VoiceResponse();
    response.say('An error occurred processing your call.');
    response.hangup();
    return response.toString();
  }

  private generateInitialTwiML(ivrFlow: IvrFlow): string {
    const response = new twiml.VoiceResponse();
    response.redirect({
      method: 'POST',
    }, `/telephony/fonabot/ivr-step?CallSid=${callData.CallSid}`);
    return response.toString();
  }
}