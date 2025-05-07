import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getCallSession(callSid: string): Promise<any> {
    return this.cacheManager.get(`call:${callSid}`);
  }

  async setCallSession(callSid: string, data: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(`call:${callSid}`, data, ttl);
  }

  async deleteCallSession(callSid: string): Promise<void> {
    await this.cacheManager.del(`call:${callSid}`);
  }

  async updateCallSession(callSid: string, updates: Partial<any>): Promise<void> {
    const session = await this.getCallSession(callSid);
    if (session) {
      await this.setCallSession(callSid, { ...session, ...updates });
    }
  }
}