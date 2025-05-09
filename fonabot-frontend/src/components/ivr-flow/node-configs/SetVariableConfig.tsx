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

const VariableRow = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  align-items: center;
  margin-bottom: ${theme.spacing.sm};
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #4338ca;
  }

  &.delete {
    background-color: ${theme.colors.error};
  }
`;

interface Variable {
  id: string;
  name: string;
  value: string;
  expression?: string;
}

interface SetVariableConfigProps {
  data: NodeData;
  onChange: (data: NodeData) => void;
}

export const SetVariableConfig = ({
  data,
  onChange
}: SetVariableConfigProps) => {
  const [label, setLabel] = useState(data.label || "");
  const [variables, setVariables] = useState<Variable[]>(
    data.properties?.variables || []
  );

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    onChange({
      ...data,
      label: newLabel
    });
  };

  const addVariable = () => {
    const newVariable: Variable = {
      id: `var_${Date.now()}`,
      name: "",
      value: ""
    };

    const updatedVariables = [...variables, newVariable];
    setVariables(updatedVariables);

    onChange({
      ...data,
      properties: {
        ...data.properties,
        variables: updatedVariables
      }
    });
  };

  const updateVariable = (index: number, updates: Partial<Variable>) => {
    const updatedVariables = variables.map((variable, i) =>
      i === index ? { ...variable, ...updates } : variable
    );

    setVariables(updatedVariables);

    onChange({
      ...data,
      properties: {
        ...data.properties,
        variables: updatedVariables
      }
    });
  };

  const removeVariable = (index: number) => {
    const updatedVariables = variables.filter((_, i) => i !== index);
    setVariables(updatedVariables);

    onChange({
      ...data,
      properties: {
        ...data.properties,
        variables: updatedVariables
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
        <Label>Variables</Label>
        {variables.map((variable, index) => (
          <VariableRow key={variable.id}>
            <Input
              type="text"
              value={variable.name}
              onChange={(e) => updateVariable(index, { name: e.target.value })}
              placeholder="Variable name"
              style={{ flex: 1 }}
            />
            <Input
              type="text"
              value={variable.value}
              onChange={(e) => updateVariable(index, { value: e.target.value })}
              placeholder="Value"
              style={{ flex: 1 }}
            />
            <Button
              className="delete"
              onClick={() => removeVariable(index)}
              type="button"
            >
              X
            </Button>
          </VariableRow>
        ))}
        <Button type="button" onClick={addVariable}>
          Add Variable
        </Button>
      </FormGroup>
    </ConfigContainer>
  );
};
