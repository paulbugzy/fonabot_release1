"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallLogFiltersPanel = void 0;
const react_1 = require("react");
const styled_1 = require("@emotion/styled");
const theme_1 = require("../../styles/theme");
const Panel = styled_1.default.div `
  background: white;
  border-radius: 8px;
  padding: ${theme_1.theme.spacing.lg};
  margin-bottom: ${theme_1.theme.spacing.xl};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Form = styled_1.default.form `
  display: flex;
  gap: ${theme_1.theme.spacing.lg};
  align-items: flex-end;
`;
const Field = styled_1.default.div `
  display: flex;
  flex-direction: column;
  gap: ${theme_1.theme.spacing.xs};
`;
const Label = styled_1.default.label `
  font-size: 0.9rem;
  color: ${theme_1.theme.colors.secondary};
`;
const Input = styled_1.default.input `
  padding: ${theme_1.theme.spacing.sm};
  border: 1px solid ${theme_1.theme.colors.background};
  border-radius: 4px;
  font-size: 0.9rem;
`;
const Select = styled_1.default.select `
  padding: ${theme_1.theme.spacing.sm};
  border: 1px solid ${theme_1.theme.colors.background};
  border-radius: 4px;
  font-size: 0.9rem;
`;
const Button = styled_1.default.button `
  background: ${theme_1.theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme_1.theme.spacing.sm} ${theme_1.theme.spacing.lg};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #4338ca;
  }
`;
const CallLogFiltersPanel = ({ filters, onFiltersChange }) => {
    const [formData, setFormData] = (0, react_1.useState)(filters);
    const handleSubmit = (e) => {
        e.preventDefault();
        onFiltersChange(formData);
    };
    return (<Panel>
      <Form onSubmit={handleSubmit}>
        <Field>
          <Label>Start Date</Label>
          <Input type="date" value={formData.startDate?.toISOString().split('T')[0] || ''} onChange={e => setFormData({
            ...formData,
            startDate: e.target.value ? new Date(e.target.value) : undefined
        })}/>
        </Field>

        <Field>
          <Label>End Date</Label>
          <Input type="date" value={formData.endDate?.toISOString().split('T')[0] || ''} onChange={e => setFormData({
            ...formData,
            endDate: e.target.value ? new Date(e.target.value) : undefined
        })}/>
        </Field>

        <Field>
          <Label>Status</Label>
          <Select value={formData.status || ''} onChange={e => setFormData({
            ...formData,
            status: e.target.value || undefined
        })}>
            <option value="">All</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="busy">Busy</option>
            <option value="no-answer">No Answer</option>
          </Select>
        </Field>

        <Field>
          <Label>Phone Number</Label>
          <Input type="text" placeholder="+1234567890" value={formData.phoneNumber || ''} onChange={e => setFormData({
            ...formData,
            phoneNumber: e.target.value || undefined
        })}/>
        </Field>

        <Button type="submit">Apply Filters</Button>
      </Form>
    </Panel>);
};
exports.CallLogFiltersPanel = CallLogFiltersPanel;
//# sourceMappingURL=CallLogFiltersPanel.js.map