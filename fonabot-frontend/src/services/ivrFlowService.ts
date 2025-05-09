import { apiService } from "./apiService";
import type { IvrFlow } from "../types/ivrFlow";

export const ivrFlowService = {
  async getFlows(): Promise<IvrFlow[]> {
    return apiService.get<IvrFlow[]>("/ivr-flows");
  },

  async getFlow(id: string): Promise<IvrFlow> {
    return apiService.get<IvrFlow>(`/ivr-flows/${id}`);
  },

  async createFlow(data: Partial<IvrFlow>): Promise<IvrFlow> {
    return apiService.post<IvrFlow>("/ivr-flows", data);
  },

  async updateFlow(id: string, data: Partial<IvrFlow>): Promise<IvrFlow> {
    return apiService.put<IvrFlow>(`/ivr-flows/${id}`, data);
  },

  async deleteFlow(id: string): Promise<void> {
    return apiService.delete(`/ivr-flows/${id}`);
  }
};
