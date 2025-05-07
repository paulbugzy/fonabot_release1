import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IvrFlow } from '../entities/ivr-flow.entity';
import { IvrFlowNode } from '../entities/ivr-flow-node.entity';
import { IvrFlowEdge } from '../entities/ivr-flow-edge.entity';
import { CreateFonaBotIvrFlowDto, UpdateFonaBotIvrFlowDto } from './dto/ivr-flow.dto';

@Injectable()
export class IvrFlowService {
  constructor(
    @InjectRepository(IvrFlow)
    private ivrFlowRepository: Repository<IvrFlow>,
    @InjectRepository(IvrFlowNode)
    private ivrFlowNodeRepository: Repository<IvrFlowNode>,
    @InjectRepository(IvrFlowEdge)
    private ivrFlowEdgeRepository: Repository<IvrFlowEdge>,
  ) {}

  async create(createDto: CreateFonaBotIvrFlowDto, userId: string): Promise<IvrFlow> {
    const flow = this.ivrFlowRepository.create({
      userId,
      name: createDto.name,
      description: createDto.description,
      isActive: createDto.isActive ?? true,
      triggerPhoneNumber: createDto.trigger_phone_number,
    });

    const savedFlow = await this.ivrFlowRepository.save(flow);

    // Create nodes
    const nodes = createDto.nodes.map(node => 
      this.ivrFlowNodeRepository.create({
        ivrFlowId: savedFlow.id,
        nodeClientId: node.node_client_id,
        type: node.type,
        positionX: node.position_x,
        positionY: node.position_y,
        properties: node.properties,
      })
    );
    await this.ivrFlowNodeRepository.save(nodes);

    // Create edges
    const edges = createDto.edges.map(edge =>
      this.ivrFlowEdgeRepository.create({
        ivrFlowId: savedFlow.id,
        edgeClientId: edge.edge_client_id,
        sourceNodeClientId: edge.source_node_client_id,
        targetNodeClientId: edge.target_node_client_id,
        sourceHandle: edge.source_handle,
        targetHandle: edge.target_handle,
        properties: edge.properties,
      })
    );
    await this.ivrFlowEdgeRepository.save(edges);

    return this.findOne(savedFlow.id, userId);
  }

  async findAll(userId: string): Promise<IvrFlow[]> {
    return this.ivrFlowRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<IvrFlow> {
    const flow = await this.ivrFlowRepository.findOne({
      where: { id, userId },
      relations: ['nodes', 'edges'],
    });

    if (!flow) {
      throw new NotFoundException('IVR Flow not found');
    }

    return flow;
  }

  async update(id: string, updateDto: UpdateFonaBotIvrFlowDto, userId: string): Promise<IvrFlow> {
    const flow = await this.findOne(id, userId);

    // Update basic flow info
    Object.assign(flow, {
      name: updateDto.name ?? flow.name,
      description: updateDto.description ?? flow.description,
      isActive: updateDto.isActive ?? flow.isActive,
      triggerPhoneNumber: updateDto.trigger_phone_number ?? flow.triggerPhoneNumber,
    });

    await this.ivrFlowRepository.save(flow);

    // Update nodes
    await this.ivrFlowNodeRepository.delete({ ivrFlowId: id });
    const nodes = updateDto.nodes.map(node =>
      this.ivrFlowNodeRepository.create({
        ivrFlowId: id,
        nodeClientId: node.node_client_id,
        type: node.type,
        positionX: node.position_x,
        positionY: node.position_y,
        properties: node.properties,
      })
    );
    await this.ivrFlowNodeRepository.save(nodes);

    // Update edges
    await this.ivrFlowEdgeRepository.delete({ ivrFlowId: id });
    const edges = updateDto.edges.map(edge =>
      this.ivrFlowEdgeRepository.create({
        ivrFlowId: id,
        edgeClientId: edge.edge_client_id,
        sourceNodeClientId: edge.source_node_client_id,
        targetNodeClientId: edge.target_node_client_id,
        sourceHandle: edge.source_handle,
        targetHandle: edge.target_handle,
        properties: edge.properties,
      })
    );
    await this.ivrFlowEdgeRepository.save(edges);

    return this.findOne(id, userId);
  }

  async remove(id: string, userId: string): Promise<void> {
    const flow = await this.findOne(id, userId);
    await this.ivrFlowRepository.remove(flow);
  }
}