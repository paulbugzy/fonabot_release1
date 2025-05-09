import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { theme } from "../styles/theme";
import { ivrFlowService } from "../services/ivrFlowService";
import { callLogService } from "../services/callLogService";
import { TestCallModal } from "../components/TestCallModal";
import type { IvrFlow } from "../types/ivrFlow";
import type { CallLog } from "../services/callLogService";

const DashboardContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${theme.colors.secondary};
  font-size: 0.9rem;
`;

const SectionTitle = styled.h2`
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text};
`;

const RecentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};
  margin-top: ${theme.spacing.xl};
`;

const RecentCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const RecentList = styled.div`
  margin-top: ${theme.spacing.md};
`;

const RecentItem = styled.div`
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.background};

  &:last-child {
    border-bottom: none;
  }
`;

const RecentItemTitle = styled.div`
  font-weight: 500;
  margin-bottom: ${theme.spacing.xs};
`;

const RecentItemMeta = styled.div`
  color: ${theme.colors.secondary};
  font-size: 0.85rem;
`;

const TestCallButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-left: ${theme.spacing.md};

  &:hover {
    background-color: #4338ca;
  }
`;

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalFlows: 0,
    activeCalls: 0,
    totalCalls: 0,
    successRate: 0
  });

  const [recentFlows, setRecentFlows] = useState<IvrFlow[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([]);
  const [showTestCallModal, setShowTestCallModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // Load flows
        const flows = await ivrFlowService.getFlows();
        setRecentFlows(flows.slice(0, 5));

        // Load recent calls
        const { items: calls } = await callLogService.getCallLogs({}, 1, 5);
        setRecentCalls(calls);

        // Set stats
        setStats({
          totalFlows: flows.length,
          activeCalls: 0, // This would come from a real-time source
          totalCalls: calls.length,
          successRate: calculateSuccessRate(calls)
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const calculateSuccessRate = (calls: CallLog[]) => {
    if (calls.length === 0) return 0;
    const successfulCalls = calls.filter(
      (call) => call.status === "completed"
    ).length;
    return Math.round((successfulCalls / calls.length) * 100);
  };

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  return (
    <DashboardContainer>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: theme.spacing.lg
        }}
      >
        <h1>Dashboard</h1>
        <TestCallButton onClick={() => setShowTestCallModal(true)}>
          Make Test Call
        </TestCallButton>
      </div>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.totalFlows}</StatValue>
          <StatLabel>Total IVR Flows</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.activeCalls}</StatValue>
          <StatLabel>Active Calls</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalCalls}</StatValue>
          <StatLabel>Total Calls</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.successRate}%</StatValue>
          <StatLabel>Success Rate</StatLabel>
        </StatCard>
      </StatsGrid>

      <RecentGrid>
        <RecentCard>
          <SectionTitle>Recent IVR Flows</SectionTitle>
          <RecentList>
            {recentFlows.length > 0 ? (
              recentFlows.map((flow) => (
                <RecentItem key={flow.id}>
                  <RecentItemTitle>{flow.name}</RecentItemTitle>
                  <RecentItemMeta>
                    Status: {flow.isActive ? "Active" : "Inactive"} • Created:{" "}
                    {new Date(flow.created_at).toLocaleDateString()}
                  </RecentItemMeta>
                </RecentItem>
              ))
            ) : (
              <div>No IVR flows created yet</div>
            )}
          </RecentList>
        </RecentCard>

        <RecentCard>
          <SectionTitle>Recent Calls</SectionTitle>
          <RecentList>
            {recentCalls.length > 0 ? (
              recentCalls.map((call) => (
                <RecentItem key={call.id}>
                  <RecentItemTitle>
                    {call.phoneNumberFrom} → {call.phoneNumberTo}
                  </RecentItemTitle>
                  <RecentItemMeta>
                    Status: {call.status} • Duration:{" "}
                    {call.durationSeconds ? `${call.durationSeconds}s` : "N/A"}{" "}
                    • Flow: {call.ivrFlow.name}
                  </RecentItemMeta>
                </RecentItem>
              ))
            ) : (
              <div>No call logs available</div>
            )}
          </RecentList>
        </RecentCard>
      </RecentGrid>

      {showTestCallModal && (
        <TestCallModal onClose={() => setShowTestCallModal(false)} />
      )}
    </DashboardContainer>
  );
};
