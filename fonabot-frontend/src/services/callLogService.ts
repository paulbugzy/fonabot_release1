import { apiService } from './apiService';

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

export const callLogService = {
  async getCallLogs(filters?: CallLogFilters, page = 1, limit = 10): Promise<{ items: CallLog[]; total: number }> {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    if (filters?.startDate) {
      params.append('startDate', filters.startDate.toISOString());
    }
    if (filters?.endDate) {
      params.append('endDate', filters.endDate.toISOString());
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }
    if (filters?.phoneNumber) {
      params.append('phoneNumber', filters.phoneNumber);
    }

    const response = await apiService.get<{ items: CallLog[]; total: number }>(`/call-logs?${params}`);
    return response.data;
  },

  async getCallLogEvents(callLogId: string): Promise<CallLogEvent[]> {
    const response = await apiService.get<CallLogEvent[]>(`/call-logs/${callLogId}/events`);
    return response.data;
  },
};