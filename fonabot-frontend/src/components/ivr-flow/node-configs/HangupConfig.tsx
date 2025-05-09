// fonabot-frontend/src/components/ivr-flow/node-configs/HangupConfig.tsx
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

const TextArea = styled.textarea`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
`;

interface HangupConfigProps {
  data: NodeData;
  onChange: (data: NodeData) => void;
}

export const HangupConfig = ({ data, onChange }: HangupConfigProps) => {
  const [label, setLabel] = useState(data.label || "");
  const [message, setMessage] = useState(data.properties?.message || "");

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    onChange({
      ...data,
      label: newLabel
    });
  };

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
    onChange({
      ...data,
      properties: {
        ...data.properties,
        message: newMessage
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
        <Label>Goodbye Message (Optional)</Label>
        <TextArea
          value={message}
          onChange={(e) => handleMessageChange(e.target.value)}
          placeholder="Enter message to play before hanging up"
        />
      </FormGroup>
    </ConfigContainer>
  );
};
