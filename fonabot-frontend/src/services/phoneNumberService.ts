import { apiService } from './apiService';

export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  provider: string;
  providerNumberSid?: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
  assignedIvrFlowId?: string;
  webhookUrlVoice?: string;
  webhookUrlStatusCallback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePhoneNumberDto {
  phoneNumber: string;
  provider: string;
  providerNumberSid?: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
  assignedIvrFlowId?: string;
}

export interface UpdatePhoneNumberDto {
  assignedIvrFlowId?: string;
  webhookUrlVoice?: string;
  webhookUrlStatusCallback?: string;
}

export const phoneNumberService = {
  async getPhoneNumbers(): Promise<PhoneNumber[]> {
    return apiService.get<PhoneNumber[]>('/phone-numbers');
  },

  async getPhoneNumber(id: string): Promise<PhoneNumber> {
    return apiService.get<PhoneNumber>(`/phone-numbers/${id}`);
  },

  async createPhoneNumber(data: CreatePhoneNumberDto): Promise<PhoneNumber> {
    return apiService.post<PhoneNumber>('/phone-numbers', data);
  },

  async updatePhoneNumber(id: string, data: UpdatePhoneNumberDto): Promise<PhoneNumber> {
    return apiService.put<PhoneNumber>(`/phone-numbers/${id}`, data);
  },

  async deletePhoneNumber(id: string): Promise<void> {
    return apiService.delete(`/phone-numbers/${id}`);
  },
};