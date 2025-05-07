import styled from '@emotion/styled';
import { theme } from '../../styles/theme';
import { NODE_TYPES } from './nodes/types';

const PaletteContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const NodeButton = styled.div`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  margin-bottom: ${theme.spacing.xs};
  border-radius: 4px;
  background: ${theme.colors.background};
  cursor: grab;
  font-size: 0.9rem;
  
  &:hover {
    background: ${theme.colors.primary};
    color: white;
  }
`;

interface NodePaletteProps {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export const NodePalette = ({ onDragStart }: NodePaletteProps) => {
  return (
    <PaletteContainer>
      <h3>Node Types</h3>
      {Object.entries(NODE_TYPES).map(([key, type]) => (
        <NodeButton
          key={type}
          draggable
          onDragStart={(e) => onDragStart(e, type)}
        >
          {key.split('_').join(' ')}
        </NodeButton>
      ))}
    </PaletteContainer>
  );
};