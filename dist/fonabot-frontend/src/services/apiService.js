"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiService = void 0;
const axios_1 = require("axios");
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
class ApiService {
    constructor() {
        this.api = axios_1.default.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        }, (error) => Promise.reject(error));
        this.api.interceptors.response.use((response) => response, (error) => {
            if (error.response?.status === 401) {
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
            }
            return Promise.reject(this.handleError(error));
        });
    }
    handleError(error) {
        if (error.response?.data) {
            return error.response.data;
        }
        return {
            statusCode: error.response?.status || 500,
            message: error.message || 'An unexpected error occurred',
        };
    }
    async get(endpoint, config) {
        const response = await this.api.get(endpoint, config);
        return response.data;
    }
    async post(endpoint, data, config) {
        const response = await this.api.post(endpoint, data, config);
        return response.data;
    }
    async put(endpoint, data, config) {
        const response = await this.api.put(endpoint, data, config);
        return response.data;
    }
    async delete(endpoint, config) {
        const response = await this.api.delete(endpoint, config);
        return response.data;
    }
    async getPaginated(endpoint, config) {
        const response = await this.api.get(endpoint, config);
        return response.data;
    }
}
exports.apiService = new ApiService();
exports.apiService = {
    async get(endpoint) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok)
            throw new Error('API request failed');
        return response.json();
    },
    async post(endpoint, data) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok)
            throw new Error('API request failed');
        return response.json();
    },
};
//# sourceMappingURL=apiService.js.map