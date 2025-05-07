"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeConfigSidebar = void 0;
const styled_1 = require("@emotion/styled");
const theme_1 = require("../../styles/theme");
const PlayMessageConfig_1 = require("./node-configs/PlayMessageConfig");
const GetInputConfig_1 = require("./node-configs/GetInputConfig");
const TransferConfig_1 = require("./node-configs/TransferConfig");
const ConditionConfig_1 = require("./node-configs/ConditionConfig");
const WebhookConfig_1 = require("./node-configs/WebhookConfig");
const SetVariableConfig_1 = require("./node-configs/SetVariableConfig");
const AIRoutineConfig_1 = require("./node-configs/AIRoutineConfig");
const SidebarContainer = styled_1.default.div `
  position: fixed;
  right: 0;
  top: 80px;
  bottom: 0;
  width: 300px;
  background: white;
  border-left: 1px solid #E5E7EB;
  padding: ${theme_1.theme.spacing.lg};
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  overflow-y: auto;
`;
const CloseButton = styled_1.default.button `
  position: absolute;
  top: ${theme_1.theme.spacing.md};
  right: ${theme_1.theme.spacing.md};
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme_1.theme.colors.text};
  
  &:hover {
    color: ${theme_1.theme.colors.primary};
  }
`;
const NodeConfigSidebar = ({ selectedNode, onClose, onNodeUpdate }) => {
    const renderConfig = () => {
        if (!selectedNode)
            return null;
        const props = {
            data: selectedNode.data,
            onChange: (newData) => onNodeUpdate(selectedNode.id, newData),
        };
        switch (selectedNode.type) {
            case 'PlayMessageNodeFonaBot':
                return <PlayMessageConfig_1.PlayMessageConfig {...props}/>;
            case 'GetInputNodeFonaBot':
                return <GetInputConfig_1.GetInputConfig {...props}/>;
            case 'TransferNodeFonaBot':
                return <TransferConfig_1.TransferConfig {...props}/>;
            case 'ConditionNodeFonaBot':
                return <ConditionConfig_1.ConditionConfig {...props}/>;
            case 'WebhookNodeFonaBot':
                return <WebhookConfig_1.WebhookConfig {...props}/>;
            case 'SetVariableNodeFonaBot':
                return <SetVariableConfig_1.SetVariableConfig {...props}/>;
            case 'AIRoutineNodeFonaBot':
                return <AIRoutineConfig_1.AIRoutineConfig {...props}/>;
            default:
                return <div>No configuration available for this node type.</div>;
        }
    };
    return (<SidebarContainer $isOpen={!!selectedNode}>
      <CloseButton onClick={onClose}>×</CloseButton>
      <h2>{selectedNode?.type.replace('FonaBot', '')}</h2>
      {renderConfig()}
    </SidebarContainer>);
};
exports.NodeConfigSidebar = NodeConfigSidebar;
//# sourceMappingURL=NodeConfigSidebar.js.map