import { Module } from '@nestjs/common';
import { TwilioTelephonyService } from './twilio.service';
import { CredentialsModule } from '../credentials/credentials.module';

@Module({
  imports: [CredentialsModule],
  providers: [TwilioTelephonyService],
  exports: [TwilioTelephonyService],
})