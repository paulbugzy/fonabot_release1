export interface IvrFlowNode {
    node_client_id: string;
    type: string;
    position_x: number;
    position_y: number;
    properties?: Record<string, any>;
}
export interface IvrFlowEdge {
    edge_client_id: string;
    source_node_client_id: string;
    target_node_client_id: string;
    source_handle?: string;
    target_handle?: string;
    properties?: Record<string, any>;
}
export interface IvrFlow {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    trigger_phone_number?: string;
    nodes: IvrFlowNode[];
    edges: IvrFlowEdge[];
    created_at: Date;
    updated_at: Date;
}
