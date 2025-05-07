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
exports.CallLogEvent = void 0;
const typeorm_1 = require("typeorm");
const call_log_entity_1 = require("./call-log.entity");
let CallLogEvent = class CallLogEvent {
};
exports.CallLogEvent = CallLogEvent;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CallLogEvent.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'call_log_id' }),
    __metadata("design:type", String)
], CallLogEvent.prototype, "callLogId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'event_timestamp' }),
    __metadata("design:type", Date)
], CallLogEvent.prototype, "eventTimestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'node_client_id', nullable: true }),
    __metadata("design:type", String)
], CallLogEvent.prototype, "nodeClientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'node_type', nullable: true }),
    __metadata("design:type", String)
], CallLogEvent.prototype, "nodeType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'event_type' }),
    __metadata("design:type", String)
], CallLogEvent.prototype, "eventType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], CallLogEvent.prototype, "eventDetails", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => call_log_entity_1.CallLog, log => log.events, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'call_log_id' }),
    __metadata("design:type", call_log_entity_1.CallLog)
], CallLogEvent.prototype, "callLog", void 0);
exports.CallLogEvent = CallLogEvent = __decorate([
    (0, typeorm_1.Entity)('call_log_events')
], CallLogEvent);
//# sourceMappingURL=call-log-event.entity.js.map