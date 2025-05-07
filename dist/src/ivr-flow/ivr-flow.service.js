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
exports.IvrFlowService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ivr_flow_entity_1 = require("../entities/ivr-flow.entity");
const ivr_flow_node_entity_1 = require("../entities/ivr-flow-node.entity");
const ivr_flow_edge_entity_1 = require("../entities/ivr-flow-edge.entity");
let IvrFlowService = class IvrFlowService {
    constructor(ivrFlowRepository, ivrFlowNodeRepository, ivrFlowEdgeRepository) {
        this.ivrFlowRepository = ivrFlowRepository;
        this.ivrFlowNodeRepository = ivrFlowNodeRepository;
        this.ivrFlowEdgeRepository = ivrFlowEdgeRepository;
    }
    async create(createDto, userId) {
        const flow = this.ivrFlowRepository.create({
            userId,
            name: createDto.name,
            description: createDto.description,
            isActive: createDto.isActive ?? true,
            triggerPhoneNumber: createDto.trigger_phone_number,
        });
        const savedFlow = await this.ivrFlowRepository.save(flow);
        const nodes = createDto.nodes.map(node => this.ivrFlowNodeRepository.create({
            ivrFlowId: savedFlow.id,
            nodeClientId: node.node_client_id,
            type: node.type,
            positionX: node.position_x,
            positionY: node.position_y,
            properties: node.properties,
        }));
        await this.ivrFlowNodeRepository.save(nodes);
        const edges = createDto.edges.map(edge => this.ivrFlowEdgeRepository.create({
            ivrFlowId: savedFlow.id,
            edgeClientId: edge.edge_client_id,
            sourceNodeClientId: edge.source_node_client_id,
            targetNodeClientId: edge.target_node_client_id,
            sourceHandle: edge.source_handle,
            targetHandle: edge.target_handle,
            properties: edge.properties,
        }));
        await this.ivrFlowEdgeRepository.save(edges);
        return this.findOne(savedFlow.id, userId);
    }
    async findAll(userId) {
        return this.ivrFlowRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id, userId) {
        const flow = await this.ivrFlowRepository.findOne({
            where: { id, userId },
            relations: ['nodes', 'edges'],
        });
        if (!flow) {
            throw new common_1.NotFoundException('IVR Flow not found');
        }
        return flow;
    }
    async update(id, updateDto, userId) {
        const flow = await this.findOne(id, userId);
        Object.assign(flow, {
            name: updateDto.name ?? flow.name,
            description: updateDto.description ?? flow.description,
            isActive: updateDto.isActive ?? flow.isActive,
            triggerPhoneNumber: updateDto.trigger_phone_number ?? flow.triggerPhoneNumber,
        });
        await this.ivrFlowRepository.save(flow);
        await this.ivrFlowNodeRepository.delete({ ivrFlowId: id });
        const nodes = updateDto.nodes.map(node => this.ivrFlowNodeRepository.create({
            ivrFlowId: id,
            nodeClientId: node.node_client_id,
            type: node.type,
            positionX: node.position_x,
            positionY: node.position_y,
            properties: node.properties,
        }));
        await this.ivrFlowNodeRepository.save(nodes);
        await this.ivrFlowEdgeRepository.delete({ ivrFlowId: id });
        const edges = updateDto.edges.map(edge => this.ivrFlowEdgeRepository.create({
            ivrFlowId: id,
            edgeClientId: edge.edge_client_id,
            sourceNodeClientId: edge.source_node_client_id,
            targetNodeClientId: edge.target_node_client_id,
            sourceHandle: edge.source_handle,
            targetHandle: edge.target_handle,
            properties: edge.properties,
        }));
        await this.ivrFlowEdgeRepository.save(edges);
        return this.findOne(id, userId);
    }
    async remove(id, userId) {
        const flow = await this.findOne(id, userId);
        await this.ivrFlowRepository.remove(flow);
    }
};
exports.IvrFlowService = IvrFlowService;
exports.IvrFlowService = IvrFlowService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ivr_flow_entity_1.IvrFlow)),
    __param(1, (0, typeorm_1.InjectRepository)(ivr_flow_node_entity_1.IvrFlowNode)),
    __param(2, (0, typeorm_1.InjectRepository)(ivr_flow_edge_entity_1.IvrFlowEdge)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], IvrFlowService);
//# sourceMappingURL=ivr-flow.service.js.map