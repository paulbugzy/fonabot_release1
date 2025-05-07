import { Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';
import { CredentialsService } from '../credentials/credentials.service';
import { ITelephonyService, TelephonyCredentials } from './interfaces/telephony.interface';

@Injectable()
export class TwilioTelephonyService implements ITelephonyService {
  private readonly logger = new Logger(TwilioTelephonyService.name);

  constructor(private credentialsService: CredentialsService) {}

  private async getTwilioClient(userId: string): Promise<{ client: Twilio; phoneNumber: string }> {
    const credentials = await this.credentialsService.getCredentials(
      userId,
      'TwilioMain',
    ) as TelephonyCredentials;

    return {
      client: new Twilio(credentials.accountSid, credentials.authToken),
      phoneNumber: credentials.phoneNumber,
    };
  }

  async makeTestCall(
    userId: string,
    toPhoneNumber: string,
    message: string,
  ): Promise<string> {
    try {
      const { client, phoneNumber } = await this.getTwilioClient(userId);

      const call = await client.calls.create({
        twiml: `<Response><Say>${message}</Say></Response>`,
        to: toPhoneNumber,
        from: phoneNumber,
      });

      this.logger.log(`Initiated test call: ${call.sid}`);
      return call.sid;
    } catch (error) {
      this.logger.error('Failed to make test call', error);
      throw error;
    }
  }
}