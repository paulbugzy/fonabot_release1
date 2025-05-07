import { TwilioTelephonyService } from './twilio.service';
import { CallExecutionService } from './services/call-execution.service';
import { IncomingCallDto } from './dto/incoming-call.dto';
declare class MakeTestCallDto {
    phoneNumber: string;
    message: string;
}
export declare class TelephonyController {
    private telephonyService;
    private callExecutionService;
    constructor(telephonyService: TwilioTelephonyService, callExecutionService: CallExecutionService);
    handleIncomingCall(callData: IncomingCallDto): Promise<string>;
    handleIvrStep(callData: IncomingCallDto & {
        Digits?: string;
        RecordingUrl?: string;
        SpeechResult?: string;
        Confidence?: string;
        nodeId?: string;
        useASR?: string;
        timeout?: string;
    }): Promise<string>;
    makeTestCall(userId: string, dto: MakeTestCallDto): Promise<{
        callSid: any;
    }>;
}
export {};
