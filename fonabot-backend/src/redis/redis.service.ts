import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.logger.log('RedisService initialized with config:', {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD ? '[set]' : '[unset]',
      db: process.env.REDIS_DB,
    });
  }

  async getCallSession(callSid: string): Promise<any> {
    const session = await this.cacheManager.get(`call:${callSid}`);
    this.logger.log(`getCallSession(${callSid}): ${session ? 'found' : 'not found'}`);
    return session;
  }

  async setCallSession(callSid: string, data: any, ttl?: number): Promise<void> {
    await this.cacheManager.set(`call:${callSid}`, data, ttl);
    this.logger.log(`setCallSession(${callSid}): stored with TTL=${ttl || 'none'}`);
  }

  async deleteCallSession(callSid: string): Promise<void> {
    await this.cacheManager.del(`call:${callSid}`);
    this.logger.log(`deleteCallSession(${callSid}): deleted`);
  }

  async updateCallSession(callSid: string, updates: Partial<any>): Promise<void> {
    const session = await this.getCallSession(callSid);
    if (session) {
      const updatedSession = { ...session, ...updates };
      await this.setCallSession(callSid, updatedSession);
      this.logger.log(`updateCallSession(${callSid}): updated`);
    } else {
      this.logger.warn(`updateCallSession(${callSid}): session not found`);
    }
  }
}