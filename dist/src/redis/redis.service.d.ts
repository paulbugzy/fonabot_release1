import { Cache } from 'cache-manager';
export declare class RedisService {
    private cacheManager;
    constructor(cacheManager: Cache);
    getCallSession(callSid: string): Promise<any>;
    setCallSession(callSid: string, data: any, ttl?: number): Promise<void>;
    deleteCallSession(callSid: string): Promise<void>;
    updateCallSession(callSid: string, updates: Partial<any>): Promise<void>;
}
