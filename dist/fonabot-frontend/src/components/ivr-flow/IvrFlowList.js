"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IvrFlowList = void 0;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const styled_1 = require("@emotion/styled");
const theme_1 = require("../../styles/theme");
const ivrFlowService_1 = require("../../services/ivrFlowService");
const Container = styled_1.default.div `
  padding: ${theme_1.theme.spacing.lg};
`;
const Header = styled_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme_1.theme.spacing.xl};
`;
const CreateButton = (0, styled_1.default)(react_router_dom_1.Link) `
  background-color: ${theme_1.theme.colors.primary};
  color: white;
  padding: ${theme_1.theme.spacing.sm} ${theme_1.theme.spacing.lg};
  border-radius: 4px;
  text-decoration: none;
  
  &:hover {
    background-color: #4338ca;
  }
`;
const FlowGrid = styled_1.default.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme_1.theme.spacing.lg};
`;
const FlowCard = styled_1.default.div `
  background: white;
  border-radius: 8px;
  padding: ${theme_1.theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const FlowName = styled_1.default.h3 `
  margin: 0 0 ${theme_1.theme.spacing.sm};
  color: ${theme_1.theme.colors.text};
`;
const FlowDescription = styled_1.default.p `
  color: ${theme_1.theme.colors.secondary};
  margin: 0 0 ${theme_1.theme.spacing.md};
  font-size: 0.9rem;
`;
const FlowActions = styled_1.default.div `
  display: flex;
  gap: ${theme_1.theme.spacing.sm};
  margin-top: ${theme_1.theme.spacing.md};
`;
const ActionButton = (0, styled_1.default)(react_router_dom_1.Link) `
  padding: ${theme_1.theme.spacing.sm} ${theme_1.theme.spacing.md};
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  
  &.edit {
    background-color: ${theme_1.theme.colors.primary};
    color: white;
  }
  
  &.delete {
    background-color: ${theme_1.theme.colors.error};
    color: white;
  }
`;
const IvrFlowList = () => {
    const [flows, setFlows] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        loadFlows();
    }, []);
    const loadFlows = async () => {
        try {
            const data = await ivrFlowService_1.ivrFlowService.getFlows();
            setFlows(data);
            setError(null);
        }
        catch (err) {
            setError('Failed to load IVR flows');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this flow?')) {
            return;
        }
        try {
            await ivrFlowService_1.ivrFlowService.deleteFlow(id);
            setFlows(flows.filter(flow => flow.id !== id));
        }
        catch (err) {
            setError('Failed to delete flow');
        }
    };
    if (loading)
        return <div>Loading...</div>;
    if (error)
        return <div>{error}</div>;
    return (<Container>
      <Header>
        <h1>IVR Flows</h1>
        <CreateButton to="/flows/new">Create New Flow</CreateButton>
      </Header>

      <FlowGrid>
        {flows.map(flow => (<FlowCard key={flow.id}>
            <FlowName>{flow.name}</FlowName>
            <FlowDescription>{flow.description || 'No description'}</FlowDescription>
            <div>Status: {flow.isActive ? 'Active' : 'Inactive'}</div>
            {flow.trigger_phone_number && (<div>Phone: {flow.trigger_phone_number}</div>)}
            <FlowActions>
              <ActionButton to={`/flows/${flow.id}/builder`} className="edit">
                Edit Flow
              </ActionButton>
              <ActionButton to="#" className="delete" onClick={(e) => {
                e.preventDefault();
                handleDelete(flow.id);
            }}>
                Delete
              </ActionButton>
            </FlowActions>
          </FlowCard>))}
      </FlowGrid>
    </Container>);
};
exports.IvrFlowList = IvrFlowList;
//# sourceMappingURL=IvrFlowList.js.map