import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { theme } from "../styles/theme";
import { phoneNumberService } from "../services/phoneNumberService";
import type { CreatePhoneNumberDto } from "../services/phoneNumberService";
import { ivrFlowService } from "../services/ivrFlowService";
import type { IvrFlow } from "../types/ivrFlow";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.xl};
  width: 90%;
  max-width: 500px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.secondary};

  &:hover {
    color: ${theme.colors.text};
  }
`;

const Form = styled.form`
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
  font-weight: 500;
  color: ${theme.colors.text};
`;

const Input = styled.input`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
  font-size: 1rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  input {
    margin: 0;
  }
`;

const Button = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #4338ca;
  }

  &:disabled {
    background-color: #a5a5a5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: ${theme.colors.error};
  margin-top: ${theme.spacing.sm};
  font-size: 0.9rem;
`;

interface AddPhoneNumberModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddPhoneNumberModal = ({
  onClose,
  onSuccess
}: AddPhoneNumberModalProps) => {
  const [formData, setFormData] = useState<CreatePhoneNumberDto>({
    phoneNumber: "",
    provider: "twilio",
    providerNumberSid: "",
    capabilities: {
      voice: true,
      sms: false,
      mms: false
    },
    assignedIvrFlowId: ""
  });

  const [flows, setFlows] = useState<IvrFlow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingFlows, setLoadingFlows] = useState(true);
  const [error, setError] = useState("");

  // Load IVR flows for the dropdown when component mounts
  useEffect(() => {
    const loadFlows = async () => {
      try {
        const data = await ivrFlowService.getFlows();
        setFlows(data);
      } catch (err) {
        console.error("Failed to load IVR flows:", err);
      } finally {
        setLoadingFlows(false);
      }
    };

    loadFlows();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }

    try {
      setLoading(true);
      await phoneNumberService.createPhoneNumber(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to add phone number. Please try again.");
      console.error("Error adding phone number:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Add Phone Number</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="+1234567890"
            />
          </FormGroup>

          <FormGroup>
            <Label>Provider</Label>
            <Select
              value={formData.provider}
              onChange={(e) =>
                setFormData({ ...formData, provider: e.target.value })
              }
            >
              <option value="twilio">Twilio</option>
              <option value="vonage">Vonage</option>
              <option value="other">Other</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Provider Number SID (Optional)</Label>
            <Input
              type="text"
              value={formData.providerNumberSid || ""}
              onChange={(e) =>
                setFormData({ ...formData, providerNumberSid: e.target.value })
              }
              placeholder="Enter provider number SID"
            />
          </FormGroup>

          <FormGroup>
            <Label>Capabilities</Label>
            <CheckboxGroup>
              <Checkbox>
                <input
                  type="checkbox"
                  checked={formData.capabilities.voice}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        voice: e.target.checked
                      }
                    })
                  }
                />
                <Label style={{ margin: 0 }}>Voice</Label>
              </Checkbox>

              <Checkbox>
                <input
                  type="checkbox"
                  checked={formData.capabilities.sms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        sms: e.target.checked
                      }
                    })
                  }
                />
                <Label style={{ margin: 0 }}>SMS</Label>
              </Checkbox>

              <Checkbox>
                <input
                  type="checkbox"
                  checked={formData.capabilities.mms}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      capabilities: {
                        ...formData.capabilities,
                        mms: e.target.checked
                      }
                    })
                  }
                />
                <Label style={{ margin: 0 }}>MMS</Label>
              </Checkbox>
            </CheckboxGroup>
          </FormGroup>

          <FormGroup>
            <Label>Assign to IVR Flow (Optional)</Label>
            <Select
              value={formData.assignedIvrFlowId || ""}
              onChange={(e) =>
                setFormData({ ...formData, assignedIvrFlowId: e.target.value })
              }
              disabled={loadingFlows}
            >
              <option value="">None</option>
              {flows.map((flow) => (
                <option key={flow.id} value={flow.id}>
                  {flow.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Phone Number"}
          </Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};
