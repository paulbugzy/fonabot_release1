"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ivrFlowService = void 0;
const apiService_1 = require("./apiService");
exports.ivrFlowService = {
    async getFlows() {
        const response = await apiService_1.apiService.get('/ivr-flows');
        return response.data;
    },
    async getFlow(id) {
        const response = await apiService_1.apiService.get(`/ivr-flows/${id}`);
        return response.data;
    },
    async createFlow(data) {
        const response = await apiService_1.apiService.post('/ivr-flows', data);
        return response.data;
    },
    async updateFlow(id, data) {
        const response = await apiService_1.apiService.put(`/ivr-flows/${id}`, data);
        return response.data;
    },
    async deleteFlow(id) {
        await apiService_1.apiService.delete(`/ivr-flows/${id}`);
    },
};
//# sourceMappingURL=ivrFlowService.js.map