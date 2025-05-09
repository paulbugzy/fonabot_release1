import { useState } from 'react';
import styled from '@emotion/styled';
import { theme } from '../../../styles/theme';
import type { NodeData } from '../nodes/types';

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

const Select = styled.select`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
  font-size: 0.9rem;
`;

interface GetInputConfigProps {
  data: NodeData;
  onChange: (data: NodeData) => void;
}

export const GetInputConfig = ({ data, onChange }: GetInputConfigProps) => {
  const [label, setLabel] = useState(data.label || '');
  const [prompt, setPrompt] = useState(data.properties?.prompt || '');
  const [inputType, setInputType] = useState(data.properties?.inputType || 'dtmf');
  const [timeout, setTimeout] = useState(data.properties?.timeout || 5);
  const [numDigits, setNumDigits] = useState(data.properties?.numDigits || '');

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    onChange({
      ...data,
      label: newLabel,
    });
  };

  const handlePromptChange = (newPrompt: string) => {
    setPrompt(newPrompt);
    onChange({
      ...data,
      properties: {
        ...data.properties,
        prompt: newPrompt,
      },
    });
  };

  const handleInputTypeChange = (newInputType: string) => {
    setInputType(newInputType);
    onChange({
      ...data,
      properties: {
        ...data.properties,
        inputType: newInputType,
      },
    });
  };

  const handleTimeoutChange = (newTimeout: number) => {
    setTimeout(newTimeout);
    onChange({
      ...data,
      properties: {
        ...data.properties,
        timeout: newTimeout,
      },
    });
  };

  const handleNumDigitsChange = (newNumDigits: string) => {
    setNumDigits(newNumDigits);
    onChange({
      ...data,
      properties: {
        ...data.properties,
        numDigits: newNumDigits ? parseInt(newNumDigits, 10) : undefined,
      },
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
        <Label>Prompt</Label>
        <TextArea
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Enter prompt message"
        />
      </FormGroup>

      <FormGroup>
        <Label>Input Type</Label>
        <Select
          value={inputType}
          onChange={(e) => handleInputTypeChange(e.target.value)}
        >
          <option value="dtmf">DTMF (Touch Tone)</option>
          <option value="speech">Speech</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Timeout (seconds)</Label>
        <Input
          type="number"
          value={timeout}
          onChange={(e) => handleTimeoutChange(parseInt(e.target.value, 10))}
          min="1"
          max="60"
        />
      </FormGroup>

      {inputType === 'dtmf' && (
        <FormGroup>
          <Label>Number of Digits</Label>
          <Input
            type="number"
            value={numDigits}
            onChange={(e) => handleNumDigitsChange(e.target.value)}
            min="1"
            max="10"
            placeholder="Any number"
          />
        </FormGroup>
      )}
    </ConfigContainer>
  );
};