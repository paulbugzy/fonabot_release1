import { AxiosRequestConfig } from 'axios';
import { ApiResponse, PaginatedResponse } from '../types/api';
declare class ApiService {
    private api;
    constructor();
    private setupInterceptors;
    private handleError;
    get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>>;
    getPaginated<T>(endpoint: string, config?: AxiosRequestConfig): Promise<PaginatedResponse<T>>;
}
export declare const apiService: ApiService;
export declare const apiService: {
    get<T>(endpoint: string): Promise<T>;
    post<T>(endpoint: string, data: any): Promise<T>;
};
export {};
