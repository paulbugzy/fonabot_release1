import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { theme } from '../styles/theme';
import { callLogService, CallLog, CallLogFilters } from '../services/callLogService';
import { CallLogEventModal } from '../components/call-logs/CallLogEventModal';
import { CallLogFiltersPanel } from '../components/call-logs/CallLogFiltersPanel';

const Container = styled.div`
  padding: ${theme.spacing.lg};
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

const ViewEventsButton = styled.button`
  background: ${theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #4338ca;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.xl};
`;

const PageButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? theme.colors.primary : 'white'};
  color: ${props => props.$active ? 'white' : theme.colors.text};
  border: 1px solid ${theme.colors.background};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${props => props.$active ? theme.colors.primary : theme.colors.background};
  }
`;

export const CallLogsPage = () => {
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [totalCalls, setTotalCalls] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);
  const [filters, setFilters] = useState<CallLogFilters>({});
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    loadCallLogs();
  }, [currentPage, filters]);

  const loadCallLogs = async () => {
    try {
      setLoading(true);
      const { items, total } = await callLogService.getCallLogs(filters, currentPage, ITEMS_PER_PAGE);
      setCallLogs(items);
      setTotalCalls(total);
    } catch (error) {
      console.error('Failed to load call logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCalls / ITEMS_PER_PAGE);

  return (
    <Container>
      <h1>Call Logs</h1>

      <CallLogFiltersPanel
        filters={filters}
        onFiltersChange={setFilters}
      />

      <Table>
        <thead>
          <tr>
            <Th>From</Th>
            <Th>To</Th>
            <Th>IVR Flow</Th>
            <Th>Start Time</Th>
            <Th>Duration</Th>
            <Th>Status</Th>
            <Th>Cost</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {callLogs.map(log => (
            <tr key={log.id}>
              <Td>{log.phoneNumberFrom}</Td>
              <Td>{log.phoneNumberTo}</Td>
              <Td>{log.ivrFlow.name}</Td>
              <Td>{format(new Date(log.startTime), 'MMM d, yyyy HH:mm:ss')}</Td>
              <Td>{log.durationSeconds ? `${log.durationSeconds}s` : '-'}</Td>
              <Td>{log.status}</Td>
              <Td>{log.cost ? `$${log.cost.toFixed(2)}` : '-'}</Td>
              <Td>
                <ViewEventsButton onClick={() => setSelectedCallLog(log)}>
                  View Events
                </ViewEventsButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (
          <PageButton
            key={i + 1}
            $active={currentPage === i + 1}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </PageButton>
        ))}
      </Pagination>

      {selectedCallLog && (
        <CallLogEventModal
          callLog={selectedCallLog}
          onClose={() => setSelectedCallLog(null)}
        />
      )}
    </Container>
  );
};