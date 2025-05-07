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
exports.IvrFlowEdge = void 0;
const typeorm_1 = require("typeorm");
const ivr_flow_entity_1 = require("./ivr-flow.entity");
let IvrFlowEdge = class IvrFlowEdge {
};
exports.IvrFlowEdge = IvrFlowEdge;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IvrFlowEdge.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ivr_flow_id' }),
    __metadata("design:type", String)
], IvrFlowEdge.prototype, "ivrFlowId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'edge_client_id' }),
    __metadata("design:type", String)
], IvrFlowEdge.prototype, "edgeClientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_node_client_id' }),
    __metadata("design:type", String)
], IvrFlowEdge.prototype, "sourceNodeClientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_node_client_id' }),
    __metadata("design:type", String)
], IvrFlowEdge.prototype, "targetNodeClientId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'source_handle', nullable: true }),
    __metadata("design:type", String)
], IvrFlowEdge.prototype, "sourceHandle", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'target_handle', nullable: true }),
    __metadata("design:type", String)
], IvrFlowEdge.prototype, "targetHandle", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: '{}' }),
    __metadata("design:type", Object)
], IvrFlowEdge.prototype, "properties", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], IvrFlowEdge.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], IvrFlowEdge.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ivr_flow_entity_1.IvrFlow, flow => flow.edges),
    (0, typeorm_1.JoinColumn)({ name: 'ivr_flow_id' }),
    __metadata("design:type", ivr_flow_entity_1.IvrFlow)
], IvrFlowEdge.prototype, "ivrFlow", void 0);
exports.IvrFlowEdge = IvrFlowEdge = __decorate([
    (0, typeorm_1.Entity)('ivr_flow_edges')
], IvrFlowEdge);
//# sourceMappingURL=ivr-flow-edge.entity.js.map