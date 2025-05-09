import { Controller, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { TwilioTelephonyService } from './twilio.service';
import { CallExecutionService } from './services/call-execution.service';
import { IncomingCallDto } from './dto/incoming-call.dto';
import { twiml } from 'twilio'; // Import twiml

class MakeTestCallDto {
  phoneNumber: string;
  message: string;
}

@Controller('telephony')
export class TelephonyController {
  private readonly logger = new Logger(TelephonyController.name);

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
        confidence: parseFloat(callData.Confidence || '0'),
      };
    }

    // If external ASR was used and returned 'result' object with transcript/confidence
    if (callData.RecordingUrl && callData.useASR === 'true') {
      const asrResult = await this.callExecutionService.processExternalASR( // Call the SERVICE method
        callData.CallSid,
        callData.RecordingUrl
        // Pass nodeId or other context if needed by the service method
      );
      // Assuming processExternalASR updates session variables internally now
      // OR you update them here based on asrResult before calling executeStep
      // For now, let's assume it updates session, and we just proceed
      return this.callExecutionService.executeStep(callData.CallSid); // Call with only CallSid
    } else {
      // If input came from Digits or SpeechResult, update session first
      if (input) {
        await this.callExecutionService.updateSessionVariables(callData.CallSid, {
          last_input_type: input.type,
          last_input: input.value,
          last_speech_confidence: input.confidence, // Add confidence if available
        });
      } else if (callData.timeout === 'true') {
        await this.callExecutionService.updateSessionVariables(callData.CallSid, {
          last_input_type: 'timeout',
          last_input: null,
        });
      }
      // Now execute the next step based on the updated session
      return this.callExecutionService.executeStep(callData.CallSid); // Call with only CallSid
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('test-call')
  async makeTestCall(
    @GetUser() userId: string,
    @Body() dto: MakeTestCallDto,
  ) {
    // Assuming you have a TwiML Bin URL or a Twilio Function URL that says the dto.message
    const twimlUrl = dto.message; // In this case, we expect dto.message to be the URL

    const callSid = await this.telephonyService.makeCall(
      userId,
      dto.phoneNumber,
      twimlUrl,
    );
    return { callSid };
  }
}