import { IvrFlow } from './ivr-flow.entity';
export declare class IvrFlowNode {
    id: string;
    ivrFlowId: string;
    nodeClientId: string;
    type: string;
    positionX: number;
    positionY: number;
    properties: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    ivrFlow: IvrFlow;
}
