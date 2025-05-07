export declare class FonaBotIVRNodeDto {
    node_client_id: string;
    type: string;
    position_x: number;
    position_y: number;
    properties: Record<string, any>;
}
export declare class FonaBotIVREdgeDto {
    edge_client_id: string;
    source_node_client_id: string;
    target_node_client_id: string;
    source_handle?: string;
    target_handle?: string;
    properties: Record<string, any>;
}
export declare class CreateFonaBotIvrFlowDto {
    name: string;
    description?: string;
    isActive?: boolean;
    trigger_phone_number?: string;
    nodes: FonaBotIVRNodeDto[];
    edges: FonaBotIVREdgeDto[];
}
export declare class UpdateFonaBotIvrFlowDto extends CreateFonaBotIvrFlowDto {
    name: string;
}
export declare class FonaBotIvrFlowResponseDto {
    id: string;
    name: string;
    description?: string;
    isActive: boolean;
    trigger_phone_number?: string;
    nodes: FonaBotIVRNodeDto[];
    edges: FonaBotIVREdgeDto[];
    created_at: Date;
    updated_at: Date;
}
