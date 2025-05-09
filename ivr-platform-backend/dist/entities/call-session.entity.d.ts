import { IvrFlow } from './ivr-flow.entity';
import { PhoneNumber } from './phone-number.entity';
export declare class CallSession {
    id: string;
    providerCallSid: string;
    ivrFlowId: string;
    phoneNumberFrom: string;
    phoneNumberTo: string;
    status: string;
    currentNodeClientId: string;
    variables: Record<string, any>;
    startTime: Date;
    lastActivityTime: Date;
    endTime: Date;
    errorMessage: string;
    ivrFlow: IvrFlow;
    phoneNumberToRelation: PhoneNumber;
}
