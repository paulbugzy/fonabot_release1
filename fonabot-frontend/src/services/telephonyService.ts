import { apiService } from './apiService';

export interface TestCallRequest {
  phoneNumber: string;
  message: string;
}

export interface TestCallResponse {
  callSid: string;
}

export const telephonyService = {
  async makeTestCall(data: TestCallRequest): Promise<TestCallResponse> {
    return apiService.post<TestCallResponse>('/telephony/test-call', data);
  },
};