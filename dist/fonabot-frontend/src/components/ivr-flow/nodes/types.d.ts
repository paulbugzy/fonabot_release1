export type NodeType = 'StartNodeFonaBot' | 'PlayMessageNodeFonaBot' | 'GetInputNodeFonaBot' | 'HangupNodeFonaBot' | 'TransferNodeFonaBot' | 'ConditionNodeFonaBot' | 'WebhookNodeFonaBot' | 'SetVariableNodeFonaBot' | 'AIRoutineNodeFonaBot';
export interface NodeData {
    label?: string;
    properties: Record<string, any>;
}
export declare const NODE_TYPES: {
    readonly START: "StartNodeFonaBot";
    readonly PLAY_MESSAGE: "PlayMessageNodeFonaBot";
    readonly GET_INPUT: "GetInputNodeFonaBot";
    readonly HANGUP: "HangupNodeFonaBot";
    readonly TRANSFER: "TransferNodeFonaBot";
    readonly CONDITION: "ConditionNodeFonaBot";
    readonly WEBHOOK: "WebhookNodeFonaBot";
    readonly SET_VARIABLE: "SetVariableNodeFonaBot";
    readonly AI_ROUTINE: "AIRoutineNodeFonaBot";
};
