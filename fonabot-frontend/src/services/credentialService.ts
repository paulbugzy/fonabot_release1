import { apiService } from './apiService';

export interface Credential {
  id: string;
  serviceName: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TwilioCredential {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
}

export interface DialogflowCredential {
  projectId: string;
  credentials: Record<string, any>;
}

export const credentialService = {
  async getCredentials(): Promise<Credential[]> {
    return apiService.get<Credential[]>('/credentials');
  },

  async saveCredential(serviceName: string, data: any, description?: string): Promise<Credential> {
    return apiService.post<Credential>('/credentials', {
      serviceName,
      credentials: data,
      description,
    });
  },

  async deleteCredential(id: string): Promise<void> {
    return apiService.delete(`/credentials/${id}`);
  },
};