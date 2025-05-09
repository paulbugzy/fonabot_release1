import { User } from './user.entity';
import { IvrFlow } from './ivr-flow.entity';
import { CallSession } from './call-session.entity';
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
    callSessionsTo: CallSession[];
    user: User;
    assignedIvrFlow: IvrFlow;
}
