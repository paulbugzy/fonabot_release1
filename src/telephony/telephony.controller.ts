import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { TwilioTelephonyService } from './twilio.service';
import { CallExecutionService } from './services/call-execution.service';
import { IncomingCallDto } from './dto/incoming-call.dto';

class MakeTestCallDto {
  phoneNumber: string;
  message: string;
}

@Controller('telephony')
export class TelephonyController {
  constructor(
    private telephonyService: TwilioTelephonyService,
    private callExecutionService: CallExecutionService,
  ) {}

  @Post('fonabot/incoming/voice')
  async handleIncomingCall(@Body() callData: IncomingCallDto) {
    return this.telephonyService.handleIncomingCall(callData);
  }

  @Post('fonabot/ivr-step')
  async handleIvrStep(
    @Body() callData: IncomingCallDto & {
      Digits?: string;
      RecordingUrl?: string;
      SpeechResult?: string;
      Confidence?: string;
      nodeId?: string;
      useASR?: string;
      timeout?: string;
    },
  ) {
    let input;

    if (callData.Digits) {
      input = { type: 'dtmf' as const, value: callData.Digits };
    } else if (callData.SpeechResult) {
      input = { 
        type: 'speech' as const, 
        value: callData.SpeechResult,
        confidence: parseFloat(callData.Confidence || '0')
      };
    } else if (callData.RecordingUrl && callData.useASR === 'true') {
      // Handle external ASR processing
      const result = await this.callExecutionService.processExternalASR(
        callData.CallSid,
        callData.RecordingUrl,
        callData.nodeId!
      );
      input = {
        type: 'speech' as const,
        value: result.transcript,
        confidence: result.confidence
      };
    }

    return this.callExecutionService.executeStep(callData.CallSid, input);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test-call')
  async makeTestCall(
    @GetUser() userId: string,
    @Body() dto: MakeTestCallDto,
  ) {
    const callSid = await this.telephonyService.makeTestCall(
      userId,
      dto.phoneNumber,
      dto.message,
    );
    return { callSid };
  }
}