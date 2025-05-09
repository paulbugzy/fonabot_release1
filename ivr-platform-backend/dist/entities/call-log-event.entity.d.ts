import { CallLog } from './call-log.entity';
export declare class CallLogEvent {
    id: string;
    callLogId: string;
    eventTimestamp: Date;
    nodeClientId: string;
    nodeType: string;
    eventType: string;
    eventDetails: Record<string, any>;
    callLog: CallLog;
}
