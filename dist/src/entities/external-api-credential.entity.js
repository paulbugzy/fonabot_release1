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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalApiCredential = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let ExternalApiCredential = class ExternalApiCredential {
};
exports.ExternalApiCredential = ExternalApiCredential;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ExternalApiCredential.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], ExternalApiCredential.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'service_name' }),
    __metadata("design:type", String)
], ExternalApiCredential.prototype, "serviceName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ExternalApiCredential.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'credentials_encrypted' }),
    __metadata("design:type", String)
], ExternalApiCredential.prototype, "credentialsEncrypted", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ExternalApiCredential.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ExternalApiCredential.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.externalApiCredentials, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ExternalApiCredential.prototype, "user", void 0);
exports.ExternalApiCredential = ExternalApiCredential = __decorate([
    (0, typeorm_1.Entity)('external_api_credentials')
], ExternalApiCredential);
//# sourceMappingURL=external-api-credential.entity.js.map