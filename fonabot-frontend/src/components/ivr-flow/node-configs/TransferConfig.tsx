import { useState } from "react";
import styled from "@emotion/styled";
import { theme } from "../../../styles/theme";
import type { NodeData } from "../nodes/types";

const ConfigContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: ${theme.colors.secondary};
`;

const Input = styled.input`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
  font-size: 0.9rem;
`;

interface TransferConfigProps {
  data: NodeData;
  onChange: (data: NodeData) => void;
}

export const TransferConfig = ({ data, onChange }: TransferConfigProps) => {
  const [label, setLabel] = useState(data.label || "");
  const [targetNumber, setTargetNumber] = useState(
    data.properties?.targetNumber || ""
  );
  const [timeout, setTimeout] = useState(data.properties?.timeout || 30);

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    onChange({
      ...data,
      label: newLabel
    });
  };

  const handleTargetNumberChange = (newTargetNumber: string) => {
    setTargetNumber(newTargetNumber);
    onChange({
      ...data,
      properties: {
        ...data.properties,
        targetNumber: newTargetNumber
      }
    });
  };

  const handleTimeoutChange = (newTimeout: number) => {
    setTimeout(newTimeout);
    onChange({
      ...data,
      properties: {
        ...data.properties,
        timeout: newTimeout
      }
    });
  };

  return (
    <ConfigContainer>
      <FormGroup>
        <Label>Node Label</Label>
        <Input
          type="text"
          value={label}
          onChange={(e) => handleLabelChange(e.target.value)}
          placeholder="Enter node label"
        />
      </FormGroup>

      <FormGroup>
        <Label>Target Phone Number</Label>
        <Input
          type="tel"
          value={targetNumber}
          onChange={(e) => handleTargetNumberChange(e.target.value)}
          placeholder="+1234567890"
        />
      </FormGroup>

      <FormGroup>
        <Label>Timeout (seconds)</Label>
        <Input
          type="number"
          value={timeout}
          onChange={(e) => handleTimeoutChange(parseInt(e.target.value, 10))}
          min="5"
          max="120"
        />
      </FormGroup>
    </ConfigContainer>
  );
};
