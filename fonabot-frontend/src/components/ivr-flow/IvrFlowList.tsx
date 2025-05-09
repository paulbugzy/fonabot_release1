import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { theme } from "../../styles/theme";
import type { IvrFlow } from "../../types/ivrFlow";
import { ivrFlowService } from "../../services/ivrFlowService";
import { CreateFlowModal } from "./CreateFlowModal";

const Container = styled.div`
  padding: ${theme.spacing.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

const CreateButton = styled(Link)`
  background-color: ${theme.colors.primary};
  color: white;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: 4px;
  text-decoration: none;

  &:hover {
    background-color: #4338ca;
  }
`;

const FlowGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
`;

const FlowCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FlowName = styled.h3`
  margin: 0 0 ${theme.spacing.sm};
  color: ${theme.colors.text};
`;

const FlowDescription = styled.p`
  color: ${theme.colors.secondary};
  margin: 0 0 ${theme.spacing.md};
  font-size: 0.9rem;
`;

const FlowActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const ActionButton = styled(Link)`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;

  &.edit {
    background-color: ${theme.colors.primary};
    color: white;
  }

  &.delete {
    background-color: ${theme.colors.error};
    color: white;
  }
`;

export const IvrFlowList = () => {
  const [flows, setFlows] = useState<IvrFlow[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    try {
      const data = await ivrFlowService.getFlows();
      setFlows(data);
      setError(null);
    } catch (err) {
      setError("Failed to load IVR flows");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this flow?")) {
      return;
    }

    try {
      await ivrFlowService.deleteFlow(id);
      setFlows(flows.filter((flow) => flow.id !== id));
    } catch (err) {
      setError("Failed to delete flow");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container>
      <Header>
        <h1>IVR Flows</h1>
        <CreateButton
          to="#"
          onClick={(e) => {
            e.preventDefault();
            setShowCreateModal(true);
          }}
        >
          Create New Flow
        </CreateButton>
      </Header>

      <FlowGrid>
        {flows.map((flow) => (
          <FlowCard key={flow.id}>
            <FlowName>{flow.name}</FlowName>
            <FlowDescription>
              {flow.description || "No description"}
            </FlowDescription>
            <div>Status: {flow.isActive ? "Active" : "Inactive"}</div>
            {flow.trigger_phone_number && (
              <div>Phone: {flow.trigger_phone_number}</div>
            )}
            <FlowActions>
              <ActionButton to={`/flows/${flow.id}/builder`} className="edit">
                Edit Flow
              </ActionButton>
              <ActionButton
                to="#"
                className="delete"
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(flow.id);
                }}
              >
                Delete
              </ActionButton>
            </FlowActions>
          </FlowCard>
        ))}
      </FlowGrid>

      {showCreateModal && (
        <CreateFlowModal onClose={() => setShowCreateModal(false)} />
      )}
    </Container>
  );
};
