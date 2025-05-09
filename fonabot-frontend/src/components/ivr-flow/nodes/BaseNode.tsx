import styled from "@emotion/styled";
import { Handle, Position } from "@xyflow/react";
import { theme } from "../../../styles/theme";
import type { NodeData } from "./types";

const NodeContainer = styled.div<{ $color: string }>`
  padding: ${theme.spacing.md};
  border-radius: 8px;
  background: white;
  border: 2px solid ${(props) => props.$color};
  min-width: 150px;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const NodeHeader = styled.div<{ $color: string }>`
  background: ${(props) => props.$color};
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: 4px;
  margin-bottom: ${theme.spacing.sm};
  font-size: 0.9rem;
  font-weight: 500;
`;

const NodeContent = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.text};
`;

interface BaseNodeProps {
  data: NodeData;
  color: string;
  label: string;
  sourceHandles?: string[];
  targetHandles?: string[];
}

export const BaseNode = ({
  data,
  color,
  label,
  sourceHandles = ["default"],
  targetHandles = ["default"]
}: BaseNodeProps) => {
  return (
    <NodeContainer $color={color}>
      <NodeHeader $color={color}>{label}</NodeHeader>
      <NodeContent>{data.label || "Untitled"}</NodeContent>

      {targetHandles.map((handle) => (
        <Handle
          key={`target-${handle}`}
          type="target"
          position={Position.Top}
          id={handle}
          style={{ background: color }}
        />
      ))}

      {sourceHandles.map((handle) => (
        <Handle
          key={`source-${handle}`}
          type="source"
          position={Position.Bottom}
          id={handle}
          style={{ background: color }}
        />
      ))}
    </NodeContainer>
  );
};
