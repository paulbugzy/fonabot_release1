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

const TextArea = styled.textarea`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
  font-size: 0.9rem;
  min-height: 100px;
  resize: vertical;
  font-family: monospace;
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  input {
    margin: 0;
  }
`;

interface WebhookConfigProps {
  data: NodeData;
  onChange: (data: NodeData) => void;
}

export const WebhookConfig = ({ data, onChange }: WebhookConfigProps) => {
  const [label, setLabel] = useState(data.label || "");
  const [url, setUrl] = useState(data.properties?.url || "");
  const [method, setMethod] = useState(data.properties?.method || "GET");
  const [headers, setHeaders] = useState(
    JSON.stringify(data.properties?.headers || {}, null, 2)
  );
  const [body, setBody] = useState(
    JSON.stringify(data.properties?.body || {}, null, 2)
  );
  const [storeResponse, setStoreResponse] = useState(
    data.properties?.storeResponse || false
  );

  const handleLabelChange = (newLabel: string) => {
    setLabel(newLabel);
    onChange({
      ...data,
      label: newLabel
    });
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    updateProperties({ url: newUrl });
  };

  const handleMethodChange = (newMethod: string) => {
    setMethod(newMethod);
    updateProperties({ method: newMethod });
  };

  const handleHeadersChange = (newHeaders: string) => {
    setHeaders(newHeaders);
    try {
      const parsedHeaders = JSON.parse(newHeaders);
      updateProperties({ headers: parsedHeaders });
    } catch (e) {
      // Don't update if JSON is invalid
    }
  };

  const handleBodyChange = (newBody: string) => {
    setBody(newBody);
    try {
      const parsedBody = JSON.parse(newBody);
      updateProperties({ body: parsedBody });
    } catch (e) {
      // Don't update if JSON is invalid
    }
  };

  const handleStoreResponseChange = (newStoreResponse: boolean) => {
    setStoreResponse(newStoreResponse);
    updateProperties({ storeResponse: newStoreResponse });
  };

  const updateProperties = (updates: Record<string, any>) => {
    onChange({
      ...data,
      properties: {
        ...data.properties,
        ...updates
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
        <Label>URL</Label>
        <Input
          type="text"
          value={url}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder="https://example.com/api"
        />
      </FormGroup>

      <FormGroup>
        <Label>Method</Label>
        <Select
          value={method}
          onChange={(e) => handleMethodChange(e.target.value)}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Headers (JSON)</Label>
        <TextArea
          value={headers}
          onChange={(e) => handleHeadersChange(e.target.value)}
          placeholder='{"Content-Type": "application/json"}'
        />
      </FormGroup>

      {(method === "POST" || method === "PUT") && (
        <FormGroup>
          <Label>Body (JSON)</Label>
          <TextArea
            value={body}
            onChange={(e) => handleBodyChange(e.target.value)}
            placeholder='{"key": "value"}'
          />
        </FormGroup>
      )}

      <FormGroup>
        <Checkbox>
          <input
            type="checkbox"
            checked={storeResponse}
            onChange={(e) => handleStoreResponseChange(e.target.checked)}
          />
          <Label style={{ margin: 0 }}>Store response in variables</Label>
        </Checkbox>
      </FormGroup>
    </ConfigContainer>
  );
};
