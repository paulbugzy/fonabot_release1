import { BaseNode } from "./BaseNode";
import type { NodeData } from "./types";
const StartNode = (props: { data: NodeData }) => (
  <BaseNode
    data={props.data}
    color="#10B981"
    label="Start"
    sourceHandles={["default"]}
    targetHandles={[]}
  />
);

const PlayMessageNode = (props: { data: NodeData }) => (
  <BaseNode data={props.data} color="#6366F1" label="Play Message" />
);

const GetInputNode = (props: { data: NodeData }) => (
  <BaseNode data={props.data} color="#8B5CF6" label="Get Input" />
);

const HangupNode = (props: { data: NodeData }) => (
  <BaseNode
    data={props.data}
    color="#EF4444"
    label="Hangup"
    sourceHandles={[]}
  />
);

const TransferNode = (props: { data: NodeData }) => (
  <BaseNode data={props.data} color="#F59E0B" label="Transfer" />
);

const ConditionNode = (props: { data: NodeData }) => (
  <BaseNode
    data={props.data}
    color="#3B82F6"
    label="Condition"
    sourceHandles={["true", "false"]}
  />
);

const WebhookNode = (props: { data: NodeData }) => (
  <BaseNode data={props.data} color="#EC4899" label="Webhook" />
);

const SetVariableNode = (props: { data: NodeData }) => (
  <BaseNode data={props.data} color="#14B8A6" label="Set Variable" />
);

const AIRoutineNode = (props: { data: NodeData }) => (
  <BaseNode data={props.data} color="#6366F1" label="AI Routine" />
);

export const nodeTypes = {
  StartNodeFonaBot: StartNode,
  PlayMessageNodeFonaBot: PlayMessageNode,
  GetInputNodeFonaBot: GetInputNode,
  HangupNodeFonaBot: HangupNode,
  TransferNodeFonaBot: TransferNode,
  ConditionNodeFonaBot: ConditionNode,
  WebhookNodeFonaBot: WebhookNode,
  SetVariableNodeFonaBot: SetVariableNode,
  AIRoutineNodeFonaBot: AIRoutineNode
};
