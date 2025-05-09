"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IvrFlowModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ivr_flow_controller_1 = require("./ivr-flow.controller");
const ivr_flow_service_1 = require("./ivr-flow.service");
const ivr_flow_entity_1 = require("../entities/ivr-flow.entity");
const ivr_flow_node_entity_1 = require("../entities/ivr-flow-node.entity");
const ivr_flow_edge_entity_1 = require("../entities/ivr-flow-edge.entity");
let IvrFlowModule = class IvrFlowModule {
};
exports.IvrFlowModule = IvrFlowModule;
exports.IvrFlowModule = IvrFlowModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ivr_flow_entity_1.IvrFlow, ivr_flow_node_entity_1.IvrFlowNode, ivr_flow_edge_entity_1.IvrFlowEdge])],
        controllers: [ivr_flow_controller_1.IvrFlowController],
        providers: [ivr_flow_service_1.IvrFlowService],
        exports: [ivr_flow_service_1.IvrFlowService],
    })
], IvrFlowModule);
//# sourceMappingURL=ivr-flow.module.js.map