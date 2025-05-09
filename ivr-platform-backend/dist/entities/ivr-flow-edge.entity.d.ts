import { IvrFlow } from './ivr-flow.entity';
export declare class IvrFlowEdge {
    id: string;
    ivrFlowId: string;
    edgeClientId: string;
    sourceNodeClientId: string;
    targetNodeClientId: string;
    sourceHandle: string;
    targetHandle: string;
    properties: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    ivrFlow: IvrFlow;
}
