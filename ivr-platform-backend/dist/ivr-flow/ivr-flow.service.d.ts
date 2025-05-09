import { Repository } from 'typeorm';
import { IvrFlow } from '../entities/ivr-flow.entity';
import { IvrFlowNode } from '../entities/ivr-flow-node.entity';
import { IvrFlowEdge } from '../entities/ivr-flow-edge.entity';
import { CreateFonaBotIvrFlowDto, UpdateFonaBotIvrFlowDto } from './dto/ivr-flow.dto';
export declare class IvrFlowService {
    private ivrFlowRepository;
    private ivrFlowNodeRepository;
    private ivrFlowEdgeRepository;
    constructor(ivrFlowRepository: Repository<IvrFlow>, ivrFlowNodeRepository: Repository<IvrFlowNode>, ivrFlowEdgeRepository: Repository<IvrFlowEdge>);
    create(createDto: CreateFonaBotIvrFlowDto, userId: string): Promise<IvrFlow>;
    findAll(userId: string): Promise<IvrFlow[]>;
    findOne(id: string, userId: string): Promise<IvrFlow>;
    update(id: string, updateDto: UpdateFonaBotIvrFlowDto, userId: string): Promise<IvrFlow>;
    remove(id: string, userId: string): Promise<void>;
}
