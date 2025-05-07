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
      IvrFlowEdge,
    ]),
  ],
  providers: [
    TwilioTelephonyService,
    CallExecutionService,
    TTSService,
    ASRService,
    NLUService,
    FonaBotEventsGateway
  ],
  controllers: [TelephonyController],
  exports: [TwilioTelephonyService, TTSService, ASRService, NLUService],
})