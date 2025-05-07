"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseNode = void 0;
const styled_1 = require("@emotion/styled");
const react_1 = require("@xyflow/react");
const theme_1 = require("../../../styles/theme");
const NodeContainer = styled_1.default.div `
  padding: ${theme_1.theme.spacing.md};
  border-radius: 8px;
  background: white;
  border: 2px solid ${props => props.$color};
  min-width: 150px;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;
const NodeHeader = styled_1.default.div `
  background: ${props => props.$color};
  color: white;
  padding: ${theme_1.theme.spacing.xs} ${theme_1.theme.spacing.sm};
  border-radius: 4px;
  margin-bottom: ${theme_1.theme.spacing.sm};
  font-size: 0.9rem;
  font-weight: 500;
`;
const NodeContent = styled_1.default.div `
  font-size: 0.85rem;
  color: ${theme_1.theme.colors.text};
`;
const BaseNode = ({ data, color, label, sourceHandles = ['default'], targetHandles = ['default'] }) => {
    return (<NodeContainer $color={color}>
      <NodeHeader $color={color}>{label}</NodeHeader>
      <NodeContent>
        {data.label || 'Untitled'}
      </NodeContent>
      
      {targetHandles.map(handle => (<react_1.Handle key={`target-${handle}`} type="target" position={react_1.Position.Top} id={handle} style={{ background: color }}/>))}
      
      {sourceHandles.map(handle => (<react_1.Handle key={`source-${handle}`} type="source" position={react_1.Position.Bottom} id={handle} style={{ background: color }}/>))}
    </NodeContainer>);
};
exports.BaseNode = BaseNode;
//# sourceMappingURL=BaseNode.js.map