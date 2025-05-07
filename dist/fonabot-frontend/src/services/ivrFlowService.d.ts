import { IvrFlow } from '../types/ivr-flow';
export declare const ivrFlowService: {
    getFlows(): Promise<IvrFlow[]>;
    getFlow(id: string): Promise<IvrFlow>;
    createFlow(data: Partial<IvrFlow>): Promise<IvrFlow>;
    updateFlow(id: string, data: Partial<IvrFlow>): Promise<IvrFlow>;
    deleteFlow(id: string): Promise<void>;
};
