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
exports.IvrFlowNode = void 0;
const typeorm_1 = require("typeorm");
const ivr_flow_entity_1 = require("./ivr-flow.entity");
let IvrFlowNode = class IvrFlowNode {
};
exports.IvrFlowNode = IvrFlowNode;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IvrFlowNode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ivr_flow_id' }),
    __metadata("design:type", String)
], IvrFlowNode.prototype, "ivrFlowId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'node_client_id' }),
    __metadata("design:type", String)
], IvrFlowNode.prototype, "nodeClientId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], IvrFlowNode.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'position_x', default: 0 }),
    __metadata("design:type", Number)
], IvrFlowNode.prototype, "positionX", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'position_y', default: 0 }),
    __metadata("design:type", Number)
], IvrFlowNode.prototype, "positionY", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], IvrFlowNode.prototype, "properties", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], IvrFlowNode.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], IvrFlowNode.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ivr_flow_entity_1.IvrFlow, flow => flow.nodes),
    (0, typeorm_1.JoinColumn)({ name: 'ivr_flow_id' }),
    __metadata("design:type", ivr_flow_entity_1.IvrFlow)
], IvrFlowNode.prototype, "ivrFlow", void 0);
exports.IvrFlowNode = IvrFlowNode = __decorate([
    (0, typeorm_1.Entity)('ivr_flow_nodes')
], IvrFlowNode);
//# sourceMappingURL=ivr-flow-node.entity.js.map