export type NodeType =
  | "StartNodeFonaBot"
  | "PlayMessageNodeFonaBot"
  | "GetInputNodeFonaBot"
  | "HangupNodeFonaBot"
  | "TransferNodeFonaBot"
  | "ConditionNodeFonaBot"
  | "WebhookNodeFonaBot"
  | "SetVariableNodeFonaBot"
  | "AIRoutineNodeFonaBot";

export interface NodeData {
  label?: string;
  properties?: Record<string, any>;
  [key: string]: any;
}

export const NODE_TYPES = {
  START: "StartNodeFonaBot",
  PLAY_MESSAGE: "PlayMessageNodeFonaBot",
  GET_INPUT: "GetInputNodeFonaBot",
  HANGUP: "HangupNodeFonaBot",
  TRANSFER: "TransferNodeFonaBot",
  CONDITION: "ConditionNodeFonaBot",
  WEBHOOK: "WebhookNodeFonaBot",
  SET_VARIABLE: "SetVariableNodeFonaBot",
  AI_ROUTINE: "AIRoutineNodeFonaBot"
} as const;
