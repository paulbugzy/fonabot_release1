import { User } from './user.entity';
import { IvrFlow } from './ivr-flow.entity';
export declare class PhoneNumber {
    id: string;
    userId: string;
    phoneNumber: string;
    provider: string;
    providerNumberSid: string;
    capabilities: {
        voice: boolean;
        sms: boolean;
        mms: boolean;
    };
    assignedIvrFlowId: string;
    webhookUrlVoice: string;
    webhookUrlStatusCallback: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    assignedIvrFlow: IvrFlow;
}
