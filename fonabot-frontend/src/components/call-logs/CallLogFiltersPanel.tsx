import { useState } from "react";
import styled from "@emotion/styled";
import { theme } from "../../styles/theme";
import type { CallLogFilters } from "../../services/callLogService";

const Panel = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  gap: ${theme.spacing.lg};
  align-items: flex-end;
`;

const Field = styled.div`
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

const Button = styled.button`
  background: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #4338ca;
  }
`;

interface CallLogFiltersPanelProps {
  filters: CallLogFilters;
  onFiltersChange: (filters: CallLogFilters) => void;
}

export const CallLogFiltersPanel = ({
  filters,
  onFiltersChange
}: CallLogFiltersPanelProps) => {
  const [formData, setFormData] = useState(filters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange(formData);
  };

  return (
    <Panel>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label>Start Date</Label>
          <Input
            type="date"
            value={formData.startDate?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                startDate: e.target.value ? new Date(e.target.value) : undefined
              })
            }
          />
        </Field>

        <Field>
          <Label>End Date</Label>
          <Input
            type="date"
            value={formData.endDate?.toISOString().split("T")[0] || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                endDate: e.target.value ? new Date(e.target.value) : undefined
              })
            }
          />
        </Field>

        <Field>
          <Label>Status</Label>
          <Select
            value={formData.status || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value || undefined
              })
            }
          >
            <option value="">All</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="busy">Busy</option>
            <option value="no-answer">No Answer</option>
          </Select>
        </Field>

        <Field>
          <Label>Phone Number</Label>
          <Input
            type="text"
            placeholder="+1234567890"
            value={formData.phoneNumber || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                phoneNumber: e.target.value || undefined
              })
            }
          />
        </Field>

        <Button type="submit">Apply Filters</Button>
      </Form>
    </Panel>
  );
};
