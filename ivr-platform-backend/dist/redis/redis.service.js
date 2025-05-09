"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
let RedisService = RedisService_1 = class RedisService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(RedisService_1.name);
        this.logger.log('RedisService initialized with config:', {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            password: process.env.REDIS_PASSWORD ? '[set]' : '[unset]',
            db: process.env.REDIS_DB,
        });
    }
    async getCallSession(callSid) {
        const session = await this.cacheManager.get(`call:${callSid}`);
        this.logger.log(`getCallSession(${callSid}): ${session ? 'found' : 'not found'}`);
        return session;
    }
    async setCallSession(callSid, data, ttl) {
        await this.cacheManager.set(`call:${callSid}`, data, ttl);
        this.logger.log(`setCallSession(${callSid}): stored with TTL=${ttl || 'none'}`);
    }
    async deleteCallSession(callSid) {
        await this.cacheManager.del(`call:${callSid}`);
        this.logger.log(`deleteCallSession(${callSid}): deleted`);
    }
    async updateCallSession(callSid, updates) {
        const session = await this.getCallSession(callSid);
        if (session) {
            const updatedSession = { ...session, ...updates };
            await this.setCallSession(callSid, updatedSession);
            this.logger.log(`updateCallSession(${callSid}): updated`);
        }
        else {
            this.logger.warn(`updateCallSession(${callSid}): session not found`);
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], RedisService);
//# sourceMappingURL=redis.service.js.map