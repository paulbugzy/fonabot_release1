import { apiService } from './apiService';
import { IvrFlow } from '../types/ivr-flow';

export const ivrFlowService = {
  async getFlows(): Promise<IvrFlow[]> {
    const response = await apiService.get<IvrFlow[]>('/ivr-flows');
    return response.data;
  },

  async getFlow(id: string): Promise<IvrFlow> {
    const response = await apiService.get<IvrFlow>(`/ivr-flows/${id}`);
    return response.data;
  },

  async createFlow(data: Partial<IvrFlow>): Promise<IvrFlow> {
    const response = await apiService.post<IvrFlow>('/ivr-flows', data);
    return response.data;
  },

  async updateFlow(id: string, data: Partial<IvrFlow>): Promise<IvrFlow> {
    const response = await apiService.put<IvrFlow>(`/ivr-flows/${id}`, data);
    return response.data;
  },

  async deleteFlow(id: string): Promise<void> {
    await apiService.delete(`/ivr-flows/${id}`);
  },
};