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
exports.CallSession = void 0;
const typeorm_1 = require("typeorm");
const ivr_flow_entity_1 = require("./ivr-flow.entity");
let CallSession = class CallSession {
};
exports.CallSession = CallSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CallSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'provider_call_sid', unique: true }),
    __metadata("design:type", String)
], CallSession.prototype, "providerCallSid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ivr_flow_id', nullable: true }),
    __metadata("design:type", String)
], CallSession.prototype, "ivrFlowId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number_from' }),
    __metadata("design:type", String)
], CallSession.prototype, "phoneNumberFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number_to' }),
    __metadata("design:type", String)
], CallSession.prototype, "phoneNumberTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 'initiated' }),
    __metadata("design:type", String)
], CallSession.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_node_client_id', nullable: true }),
    __metadata("design:type", String)
], CallSession.prototype, "currentNodeClientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], CallSession.prototype, "variables", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time' }),
    __metadata("design:type", Date)
], CallSession.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_activity_time' }),
    __metadata("design:type", Date)
], CallSession.prototype, "lastActivityTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', nullable: true }),
    __metadata("design:type", Date)
], CallSession.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'error_message', nullable: true }),
    __metadata("design:type", String)
], CallSession.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ivr_flow_entity_1.IvrFlow, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'ivr_flow_id' }),
    __metadata("design:type", ivr_flow_entity_1.IvrFlow)
], CallSession.prototype, "ivrFlow", void 0);
exports.CallSession = CallSession = __decorate([
    (0, typeorm_1.Entity)('call_sessions')
], CallSession);
//# sourceMappingURL=call-session.entity.js.map