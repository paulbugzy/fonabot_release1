import { Node } from '@xyflow/react';
import { NodeData } from './nodes/types';
interface NodeConfigSidebarProps {
    selectedNode: Node<NodeData> | null;
    onClose: () => void;
    onNodeUpdate: (nodeId: string, data: NodeData) => void;
}
export declare const NodeConfigSidebar: ({ selectedNode, onClose, onNodeUpdate }: NodeConfigSidebarProps) => any;
export {};
