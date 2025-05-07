"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeTypes = void 0;
const BaseNode_1 = require("./BaseNode");
const StartNode = (props) => (<BaseNode_1.BaseNode data={props.data} color="#10B981" label="Start" sourceHandles={['default']} targetHandles={[]}/>);
const PlayMessageNode = (props) => (<BaseNode_1.BaseNode data={props.data} color="#6366F1" label="Play Message"/>);
const GetInputNode = (props) => (<BaseNode_1.BaseNode data={props.data} color="#8B5CF6" label="Get Input"/>);
const HangupNode = (props) => (<BaseNode_1.BaseNode data={props.data} color="#EF4444" label="Hangup" sourceHandles={[]}/>);
const TransferNode = (props) => (<BaseNode_1.BaseNode data={props.data} color="#F59E0B" label="Transfer"/>);
const ConditionNode = (props) => (<BaseNode_1.BaseNode data={props.data} color="#3B82F6" label="Condition" sourceHandles={['true', 'false']}/>);
const WebhookNode = (props) => (<BaseNode_1.BaseNode data={props.data} color="#EC4899" label="Webhook"/>);
const SetVariableNode = (props) => (<BaseNode_1.BaseNode data={props.data} color="#14B8A6" label="Set Variable"/>);
const AIRoutineNode = (props) => (<BaseNode_1.BaseNode data={props.data} color="#6366F1" label="AI Routine"/>);
exports.nodeTypes = {
    StartNodeFonaBot: StartNode,
    PlayMessageNodeFonaBot: PlayMessageNode,
    GetInputNodeFonaBot: GetInputNode,
    HangupNodeFonaBot: HangupNode,
    TransferNodeFonaBot: TransferNode,
    ConditionNodeFonaBot: ConditionNode,
    WebhookNodeFonaBot: WebhookNode,
    SetVariableNodeFonaBot: SetVariableNode,
    AIRoutineNodeFonaBot: AIRoutineNode,
};
//# sourceMappingURL=NodeTypes.js.map