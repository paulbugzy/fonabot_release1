"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodePalette = void 0;
const styled_1 = require("@emotion/styled");
const theme_1 = require("../../styles/theme");
const types_1 = require("./nodes/types");
const PaletteContainer = styled_1.default.div `
  background: white;
  border-radius: 8px;
  padding: ${theme_1.theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const NodeButton = styled_1.default.div `
  padding: ${theme_1.theme.spacing.sm} ${theme_1.theme.spacing.md};
  margin-bottom: ${theme_1.theme.spacing.xs};
  border-radius: 4px;
  background: ${theme_1.theme.colors.background};
  cursor: grab;
  font-size: 0.9rem;
  
  &:hover {
    background: ${theme_1.theme.colors.primary};
    color: white;
  }
`;
const NodePalette = ({ onDragStart }) => {
    return (<PaletteContainer>
      <h3>Node Types</h3>
      {Object.entries(types_1.NODE_TYPES).map(([key, type]) => (<NodeButton key={type} draggable onDragStart={(e) => onDragStart(e, type)}>
          {key.split('_').join(' ')}
        </NodeButton>))}
    </PaletteContainer>);
};
exports.NodePalette = NodePalette;
//# sourceMappingURL=NodePalette.js.map