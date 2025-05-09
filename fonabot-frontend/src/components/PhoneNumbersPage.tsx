import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { theme } from "../styles/theme";
import { phoneNumberService } from "../services/phoneNumberService";
import type { PhoneNumber } from "../services/phoneNumberService";
import { ivrFlowService } from "../services/ivrFlowService";
import { AddPhoneNumberModal } from "./AddPhoneNumberModal";

const Container = styled.div`
  padding: ${theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

const AddButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #4338ca;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  padding: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.background};
  color: ${theme.colors.secondary};
  font-weight: 600;
`;

const Td = styled.td`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.background};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  cursor: pointer;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  margin-right: ${theme.spacing.sm};

  &:hover {
    text-decoration: underline;
  }

  &.delete {
    color: ${theme.colors.error};
  }
`;

const Badge = styled.span<{ $type: "success" | "warning" | "error" }>`
  display: inline-block;
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${(props) =>
    props.$type === "success"
      ? "#ECFDF5"
      : props.$type === "warning"
        ? "#FEF3C7"
        : "#FEE2E2"};
  color: ${(props) =>
    props.$type === "success"
      ? "#065F46"
      : props.$type === "warning"
        ? "#92400E"
        : "#B91C1C"};
  margin-right: ${theme.spacing.xs};
`;

export const PhoneNumbersPage = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<
    (PhoneNumber & { assignedIvrFlowName?: string })[]
  >([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPhoneNumbers();
  }, []);

  const loadPhoneNumbers = async () => {
    try {
      setLoading(true);
      const numbers = await phoneNumberService.getPhoneNumbers();

      // Load flow names for assigned flows
      const numbersWithFlowNames = await Promise.all(
        numbers.map(async (number) => {
          if (number.assignedIvrFlowId) {
            try {
              const flow = await ivrFlowService.getFlow(
                number.assignedIvrFlowId
              );
              return {
                ...number,
                assignedIvrFlowName: flow.name
              };
            } catch (err) {
              return {
                ...number,
                assignedIvrFlowName: "Unknown Flow"
              };
            }
          }
          return number;
        })
      );

      setPhoneNumbers(numbersWithFlowNames);
      setError(null);
    } catch (err) {
      setError("Failed to load phone numbers");
      console.error("Error loading phone numbers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNumber = () => setShowAddModal(true);

  const handleEdit = (id: string) => {
    // This would open a modal to edit the number
    alert(`Edit number ${id}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this phone number?")) {
      try {
        phoneNumberService.deletePhoneNumber(id);
        setPhoneNumbers(phoneNumbers.filter((num) => num.id !== id));
      } catch (err) {
        setError("Failed to delete phone number");
        console.error("Error deleting phone number:", err);
      }
    }
  };

  if (loading) {
    return <div>Loading phone numbers...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <Header>
        <h1>Phone Numbers</h1>
        <AddButton onClick={handleAddNumber}>Add Phone Number</AddButton>
      </Header>

      <Table>
        <thead>
          <tr>
            <Th>Phone Number</Th>
            <Th>Provider</Th>
            <Th>Capabilities</Th>
            <Th>Assigned Flow</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {phoneNumbers.map((number) => (
            <tr key={number.id}>
              <Td>{number.phoneNumber}</Td>
              <Td>{number.provider}</Td>
              <Td>
                {number.capabilities.voice && (
                  <Badge $type="success">Voice</Badge>
                )}
                {number.capabilities.sms && <Badge $type="success">SMS</Badge>}
                {number.capabilities.mms && <Badge $type="success">MMS</Badge>}
              </Td>
              <Td>{number.assignedIvrFlowName || "None"}</Td>
              <Td>
                <ActionButton onClick={() => handleEdit(number.id)}>
                  Edit
                </ActionButton>
                <ActionButton
                  className="delete"
                  onClick={() => handleDelete(number.id)}
                >
                  Delete
                </ActionButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showAddModal && (
        <AddPhoneNumberModal
          onClose={() => setShowAddModal(false)}
          onSuccess={loadPhoneNumbers}
        />
      )}
    </Container>
  );
};
