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

const Select = styled.select`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
  font-size: 0.9rem;
`;

interface AIRoutineConfigProps {
  data: NodeData;
  onChange: (data: NodeData) => void;
}

export const AIRoutineConfig = ({ data, onChange }: AIRoutineConfigProps) => {
  const [label, setLabel] = useState(data.label || '');
  const [serviceName, setServiceName] = useState(data.properties?.nlu_service_name || '');
  const [projectId, setProjectId] = useState(data.properties?.nlu_config?.projectId || '');
  const [languageCode, setLanguageCode] = useState(data.properties?.nlu_config?.languageCode || 'en-US');
  const [inputVariable, setInputVariable] = useState(
    data.properties?.inputVariables?.[0] || 'last_input'
  );

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    onChange({
      ...data,
      label: newLabel,
    });
  };

  const handleServiceNameChange = (newServiceName: string) => {
    setServiceName(newServiceName);
    updateProperties({ nlu_service_name: newServiceName });
  };

  const handleProjectIdChange = (newProjectId: string) => {
    setProjectId(newProjectId);
    updateNluConfig({ projectId: newProjectId });
  };

  const handleLanguageCodeChange = (newLanguageCode: string) => {
    setLanguageCode(newLanguageCode);
    updateNluConfig({ languageCode: newLanguageCode });
  };

  const handleInputVariableChange = (newInputVariable: string) => {
    setInputVariable(newInputVariable);
    updateProperties({ inputVariables: [newInputVariable] });
  };

  const updateNluConfig = (updates: Record<string, any>) => {
    onChange({
      ...data,
      properties: {
        ...data.properties,
        nlu_config: {
          ...(data.properties?.nlu_config || {}),
          ...updates,
        },
      },
    });
  };

  const updateProperties = (updates: Record<string, any>) => {
    onChange({
      ...data,
      properties: {
        ...data.properties,
        ...updates,
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
        <Label>NLU Service Name</Label>
        <Input
          type="text"
          value={serviceName}
          onChange={(e) => handleServiceNameChange(e.target.value)}
          placeholder="e.g., DialogflowMain"
        />
      </FormGroup>

      <FormGroup>
        <Label>Project ID</Label>
        <Input
          type="text"
          value={projectId}
          onChange={(e) => handleProjectIdChange(e.target.value)}
          placeholder="Dialogflow project ID"
        />
      </FormGroup>

      <FormGroup>
        <Label>Language Code</Label>
        <Select
          value={languageCode}
          onChange={(e) => handleLanguageCodeChange(e.target.value)}
        >
          <option value="en-US">English (US)</option>
          <option value="en-GB">English (UK)</option>
          <option value="es-ES">Spanish</option>
          <option value="fr-FR">French</option>
          <option value="de-DE">German</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Input Variable</Label>
        <Input
          type="text"
          value={inputVariable}
          onChange={(e) => handleInputVariableChange(e.target.value)}
          placeholder="Variable containing input text"
        />
      </FormGroup>
    </ConfigContainer>
  );
};