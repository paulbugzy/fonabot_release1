"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callLogService = void 0;
const apiService_1 = require("./apiService");
exports.callLogService = {
    async getCallLogs(filters, page = 1, limit = 10) {
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
        const response = await apiService_1.apiService.get(`/call-logs?${params}`);
        return response.data;
    },
    async getCallLogEvents(callLogId) {
        const response = await apiService_1.apiService.get(`/call-logs/${callLogId}/events`);
        return response.data;
    },
};
//# sourceMappingURL=callLogService.js.map