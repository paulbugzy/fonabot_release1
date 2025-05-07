import { User } from './user.entity';
import { IvrFlow } from './ivr-flow.entity';
import { CallLogEvent } from './call-log-event.entity';
export declare class CallLog {
    id: string;
    providerCallSid: string;
    userId: string;
    ivrFlowId: string;
    phoneNumberFrom: string;
    phoneNumberTo: string;
    startTime: Date;
    endTime: Date;
    durationSeconds: number;
    status: string;
    dispositionDetails: string;
    callTranscriptSummary: string;
    cost: number;
    createdAt: Date;
    user: User;
    ivrFlow: IvrFlow;
    events: CallLogEvent[];
}
