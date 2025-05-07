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
exports.PhoneNumber = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const ivr_flow_entity_1 = require("./ivr-flow.entity");
let PhoneNumber = class PhoneNumber {
};
exports.PhoneNumber = PhoneNumber;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PhoneNumber.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", String)
], PhoneNumber.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', unique: true }),
    __metadata("design:type", String)
], PhoneNumber.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PhoneNumber.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'provider_number_sid', nullable: true, unique: true }),
    __metadata("design:type", String)
], PhoneNumber.prototype, "providerNumberSid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '{"voice": false, "sms": false, "mms": false}' }),
    __metadata("design:type", Object)
], PhoneNumber.prototype, "capabilities", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assigned_ivr_flow_id', nullable: true }),
    __metadata("design:type", String)
], PhoneNumber.prototype, "assignedIvrFlowId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'webhook_url_voice', nullable: true }),
    __metadata("design:type", String)
], PhoneNumber.prototype, "webhookUrlVoice", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'webhook_url_status_callback', nullable: true }),
    __metadata("design:type", String)
], PhoneNumber.prototype, "webhookUrlStatusCallback", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PhoneNumber.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PhoneNumber.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], PhoneNumber.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ivr_flow_entity_1.IvrFlow, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_ivr_flow_id' }),
    __metadata("design:type", ivr_flow_entity_1.IvrFlow)
], PhoneNumber.prototype, "assignedIvrFlow", void 0);
exports.PhoneNumber = PhoneNumber = __decorate([
    (0, typeorm_1.Entity)('phone_numbers')
], PhoneNumber);
//# sourceMappingURL=phone-number.entity.js.map