import { User } from './user.entity';
import { IvrFlowNode } from './ivr-flow-node.entity';
import { IvrFlowEdge } from './ivr-flow-edge.entity';
export declare class IvrFlow {
    id: string;
    userId: string;
    name: string;
    description: string;
    isActive: boolean;
    triggerPhoneNumber: string;
    createdAt: Date;
    updatedAt: Date;
    user: User;
    nodes: IvrFlowNode[];
    edges: IvrFlowEdge[];
}
