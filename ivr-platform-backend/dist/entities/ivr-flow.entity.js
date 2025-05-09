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
exports.IvrFlow = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const ivr_flow_node_entity_1 = require("./ivr-flow-node.entity");
const ivr_flow_edge_entity_1 = require("./ivr-flow-edge.entity");
let IvrFlow = class IvrFlow {
};
exports.IvrFlow = IvrFlow;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IvrFlow.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], IvrFlow.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], IvrFlow.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], IvrFlow.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], IvrFlow.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'trigger_phone_number', nullable: true, unique: true }),
    __metadata("design:type", String)
], IvrFlow.prototype, "triggerPhoneNumber", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], IvrFlow.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], IvrFlow.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.ivrFlows),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], IvrFlow.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ivr_flow_node_entity_1.IvrFlowNode, node => node.ivrFlow),
    __metadata("design:type", Array)
], IvrFlow.prototype, "nodes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ivr_flow_edge_entity_1.IvrFlowEdge, edge => edge.ivrFlow),
    __metadata("design:type", Array)
], IvrFlow.prototype, "edges", void 0);
exports.IvrFlow = IvrFlow = __decorate([
    (0, typeorm_1.Entity)('ivr_flows')
], IvrFlow);
//# sourceMappingURL=ivr-flow.entity.js.map