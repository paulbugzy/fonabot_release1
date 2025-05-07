export interface CallLog {
    id: string;
    phoneNumberFrom: string;
    phoneNumberTo: string;
    ivrFlow: {
        id: string;
        name: string;
    };
    startTime: Date;
    endTime?: Date;
    durationSeconds?: number;
    status: string;
    cost?: number;
    events: CallLogEvent[];
}
export interface CallLogEvent {
    id: string;
    eventTimestamp: Date;
    nodeType?: string;
    eventType: string;
    eventDetails: Record<string, any>;
}
export interface CallLogFilters {
    startDate?: Date;
    endDate?: Date;
    status?: string;
    phoneNumber?: string;
}
export declare const callLogService: {
    getCallLogs(filters?: CallLogFilters, page?: number, limit?: number): Promise<{
        items: CallLog[];
        total: number;
    }>;
    getCallLogEvents(callLogId: string): Promise<CallLogEvent[]>;
};
