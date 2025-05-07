import styled from '@emotion/styled';
import { Node } from '@xyflow/react';
import { theme } from '../../styles/theme';
import { NodeData, NodeType } from './nodes/types';
import { PlayMessageConfig } from './node-configs/PlayMessageConfig';
import { GetInputConfig } from './node-configs/GetInputConfig';
import { TransferConfig } from './node-configs/TransferConfig';
import { ConditionConfig } from './node-configs/ConditionConfig';
import { WebhookConfig } from './node-configs/WebhookConfig';
import { SetVariableConfig } from './node-configs/SetVariableConfig';
import { AIRoutineConfig } from './node-configs/AIRoutineConfig';

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  right: 0;
  top: 80px;
  bottom: 0;
  width: 300px;
  background: white;
  border-left: 1px solid #E5E7EB;
  padding: ${theme.spacing.lg};
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${theme.spacing.md};
  right: ${theme.spacing.md};
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.text};
  
  &:hover {
    color: ${theme.colors.primary};
  }
`;

interface NodeConfigSidebarProps {
  selectedNode: Node<NodeData> | null;
  onClose: () => void;
  onNodeUpdate: (nodeId: string, data: NodeData) => void;
}

export const NodeConfigSidebar = ({ selectedNode, onClose, onNodeUpdate }: NodeConfigSidebarProps) => {
  const renderConfig = () => {
    if (!selectedNode) return null;

    const props = {
      data: selectedNode.data,
      onChange: (newData: NodeData) => onNodeUpdate(selectedNode.id, newData),
    };

    switch (selectedNode.type as NodeType) {
      case 'PlayMessageNodeFonaBot':
        return <PlayMessageConfig {...props} />;
      case 'GetInputNodeFonaBot':
        return <GetInputConfig {...props} />;
      case 'TransferNodeFonaBot':
        return <TransferConfig {...props} />;
      case 'ConditionNodeFonaBot':
        return <ConditionConfig {...props} />;
      case 'WebhookNodeFonaBot':
        return <WebhookConfig {...props} />;
      case 'SetVariableNodeFonaBot':
        return <SetVariableConfig {...props} />;
      case 'AIRoutineNodeFonaBot':
        return <AIRoutineConfig {...props} />;
      default:
        return <div>No configuration available for this node type.</div>;
    }
  };

  return (
    <SidebarContainer $isOpen={!!selectedNode}>
      <CloseButton onClick={onClose}>×</CloseButton>
      <h2>{selectedNode?.type.replace('FonaBot', '')}</h2>
      {renderConfig()}
    </SidebarContainer>
  );
};