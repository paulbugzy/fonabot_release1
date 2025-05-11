import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { TwilioTelephonyService } from './twilio.service';
import { CallExecutionService } from './services/call-execution.service';
import { ASRService } from './services/asr.service';
import { FonaBotEventsGateway } from './gateways/fonabot-events.gateway';
import { NLUService } from './services/nlu.service';
import { TelephonyController } from './telephony.controller';
import { CredentialsModule } from '../credentials/credentials.module';
import { PhoneNumber } from '../entities/phone-number.entity';
import { CallSession } from '../entities/call-session.entity';
import { CallLog } from '../entities/call-log.entity';
import { CallLogEvent } from '../entities/call-log-event.entity';
import { IvrFlow } from '../entities/ivr-flow.entity';
import { IvrFlowNode } from '../entities/ivr-flow-node.entity'; 
import { IvrFlowEdge } from '../entities/ivr-flow-edge.entity'; 
import { TTSService } from './services/tts.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    CredentialsModule,
    HttpModule,
    TypeOrmModule.forFeature([
      PhoneNumber,
      CallSession,
      CallLog,
      CallLogEvent,
      IvrFlow,
      IvrFlowNode,
      IvrFlowEdge
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'cd508c706ce02323501b89fb64b2dc6ebf672d5d8150b399c5f6155c58b85bc8',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
  ],
  providers: [
    FonaBotEventsGateway,
    TwilioTelephonyService,
    CallExecutionService,
    TTSService,
    ASRService,
    NLUService,
  ],
  controllers: [TelephonyController],
  exports: [CallExecutionService, TwilioTelephonyService, TTSService, ASRService, NLUService],
})

export class TelephonyModule {}