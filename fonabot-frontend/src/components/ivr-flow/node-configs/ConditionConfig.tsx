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

const Select = styled.select`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
  font-size: 0.9rem;
`;

const ConditionRow = styled.div`
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

interface Condition {
  id: string;
  variableName: string;
  operator: "equals" | "contains" | "greaterThan" | "lessThan";
  value: string;
}

interface ConditionConfigProps {
  data: NodeData;
  onChange: (data: NodeData) => void;
}

export const ConditionConfig = ({ data, onChange }: ConditionConfigProps) => {
  const [label, setLabel] = useState(data.label || "");
  const [conditions, setConditions] = useState<Condition[]>(
    data.properties?.conditions || []
  );

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    onChange({
      ...data,
      label: newLabel
    });
  };

  const addCondition = () => {
    const newCondition: Condition = {
      id: `condition_${Date.now()}`,
      variableName: "",
      operator: "equals",
      value: ""
    };

    const updatedConditions = [...conditions, newCondition];
    setConditions(updatedConditions);

    onChange({
      ...data,
      properties: {
        ...data.properties,
        conditions: updatedConditions
      }
    });
  };

  const updateCondition = (index: number, updates: Partial<Condition>) => {
    const updatedConditions = conditions.map((condition, i) =>
      i === index ? { ...condition, ...updates } : condition
    );

    setConditions(updatedConditions);

    onChange({
      ...data,
      properties: {
        ...data.properties,
        conditions: updatedConditions
      }
    });
  };

  const removeCondition = (index: number) => {
    const updatedConditions = conditions.filter((_, i) => i !== index);
    setConditions(updatedConditions);

    onChange({
      ...data,
      properties: {
        ...data.properties,
        conditions: updatedConditions
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
        <Label>Conditions</Label>
        {conditions.map((condition, index) => (
          <ConditionRow key={condition.id}>
            <Input
              type="text"
              value={condition.variableName}
              onChange={(e) =>
                updateCondition(index, { variableName: e.target.value })
              }
              placeholder="Variable name"
              style={{ flex: 1 }}
            />
            <Select
              value={condition.operator}
              onChange={(e) =>
                updateCondition(index, { operator: e.target.value as any })
              }
              style={{ width: "120px" }}
            >
              <option value="equals">equals</option>
              <option value="contains">contains</option>
              <option value="greaterThan">greater than</option>
              <option value="lessThan">less than</option>
            </Select>
            <Input
              type="text"
              value={condition.value}
              onChange={(e) =>
                updateCondition(index, { value: e.target.value })
              }
              placeholder="Value"
              style={{ flex: 1 }}
            />
            <Button
              className="delete"
              onClick={() => removeCondition(index)}
              type="button"
            >
              X
            </Button>
          </ConditionRow>
        ))}
        <Button type="button" onClick={addCondition}>
          Add Condition
        </Button>
      </FormGroup>
    </ConfigContainer>
  );
};
