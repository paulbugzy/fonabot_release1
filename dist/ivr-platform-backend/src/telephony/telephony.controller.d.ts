import { TwilioTelephonyService } from './twilio.service';
declare class MakeTestCallDto {
    phoneNumber: string;
    message: string;
}
export declare class TelephonyController {
    private telephonyService;
    constructor(telephonyService: TwilioTelephonyService);
    makeTestCall(userId: string, dto: MakeTestCallDto): Promise<{
        callSid: string;
    }>;
}
export {};
