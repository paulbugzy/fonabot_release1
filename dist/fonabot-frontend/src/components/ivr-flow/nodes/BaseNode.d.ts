import { NodeData } from './types';
interface BaseNodeProps {
    data: NodeData;
    color: string;
    label: string;
    sourceHandles?: string[];
    targetHandles?: string[];
}
export declare const BaseNode: ({ data, color, label, sourceHandles, targetHandles }: BaseNodeProps) => any;
export {};
