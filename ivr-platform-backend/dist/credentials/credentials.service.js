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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const config_1 = require("@nestjs/config");
const external_api_credential_entity_1 = require("../entities/external-api-credential.entity");
let CredentialsService = class CredentialsService {
    constructor(credentialsRepository, configService) {
        this.credentialsRepository = credentialsRepository;
        this.configService = configService;
        this.algorithm = 'aes-256-cbc';
        const key = this.configService.get('MASTER_ENCRYPTION_KEY');
        if (!key) {
            throw new Error('MASTER_ENCRYPTION_KEY not configured');
        }
        this.masterKey = Buffer.from(key, 'hex');
    }
    encrypt(text) {
        const iv = (0, crypto_1.randomBytes)(16);
        const cipher = (0, crypto_1.createCipheriv)(this.algorithm, this.masterKey, iv);
        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
        return {
            encrypted: encrypted.toString('hex'),
            iv: iv.toString('hex'),
        };
    }
    decrypt(encrypted, iv) {
        const decipher = (0, crypto_1.createDecipheriv)(this.algorithm, this.masterKey, Buffer.from(iv, 'hex'));
        const decrypted = Buffer.concat([
            decipher.update(Buffer.from(encrypted, 'hex')),
            decipher.final(),
        ]);
        return decrypted.toString();
    }
    async getCredentials(userId, serviceName) {
        const credential = await this.credentialsRepository.findOne({
            where: { userId, serviceName },
        });
        if (!credential) {
            throw new common_1.NotFoundException(`Credentials not found for service: ${serviceName}`);
        }
        const [encrypted, iv] = credential.credentialsEncrypted.split(':');
        const decrypted = this.decrypt(encrypted, iv);
        return JSON.parse(decrypted);
    }
    async saveCredentials(userId, serviceName, credentials) {
        const { encrypted, iv } = this.encrypt(JSON.stringify(credentials));
        const credentialsEncrypted = `${encrypted}:${iv}`;
        await this.credentialsRepository.save({
            userId,
            serviceName,
            credentialsEncrypted,
        });
    }
};
exports.CredentialsService = CredentialsService;
exports.CredentialsService = CredentialsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(external_api_credential_entity_1.ExternalApiCredential)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], CredentialsService);
//# sourceMappingURL=credentials.service.js.map