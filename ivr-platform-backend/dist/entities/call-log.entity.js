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
exports.CallLog = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const ivr_flow_entity_1 = require("./ivr-flow.entity");
const call_log_event_entity_1 = require("./call-log-event.entity");
let CallLog = class CallLog {
};
exports.CallLog = CallLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CallLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'provider_call_sid' }),
    __metadata("design:type", String)
], CallLog.prototype, "providerCallSid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: true }),
    __metadata("design:type", String)
], CallLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ivr_flow_id', nullable: true }),
    __metadata("design:type", String)
], CallLog.prototype, "ivrFlowId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number_from' }),
    __metadata("design:type", String)
], CallLog.prototype, "phoneNumberFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number_to' }),
    __metadata("design:type", String)
], CallLog.prototype, "phoneNumberTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'start_time' }),
    __metadata("design:type", Date)
], CallLog.prototype, "startTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'end_time', nullable: true }),
    __metadata("design:type", Date)
], CallLog.prototype, "endTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'duration_seconds', nullable: true }),
    __metadata("design:type", Number)
], CallLog.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CallLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'disposition_details', nullable: true }),
    __metadata("design:type", String)
], CallLog.prototype, "dispositionDetails", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'call_transcript_summary', nullable: true }),
    __metadata("design:type", String)
], CallLog.prototype, "callTranscriptSummary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 5, nullable: true }),
    __metadata("design:type", Number)
], CallLog.prototype, "cost", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CallLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], CallLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ivr_flow_entity_1.IvrFlow, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'ivr_flow_id' }),
    __metadata("design:type", ivr_flow_entity_1.IvrFlow)
], CallLog.prototype, "ivrFlow", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => call_log_event_entity_1.CallLogEvent, event => event.callLog),
    __metadata("design:type", Array)
], CallLog.prototype, "events", void 0);
exports.CallLog = CallLog = __decorate([
    (0, typeorm_1.Entity)('call_logs')
], CallLog);
//# sourceMappingURL=call-log.entity.js.map