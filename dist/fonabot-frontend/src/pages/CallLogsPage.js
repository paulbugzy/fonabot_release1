"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallLogsPage = void 0;
const react_1 = require("react");
const styled_1 = require("@emotion/styled");
const date_fns_1 = require("date-fns");
const theme_1 = require("../styles/theme");
const callLogService_1 = require("../services/callLogService");
const CallLogEventModal_1 = require("../components/call-logs/CallLogEventModal");
const CallLogFiltersPanel_1 = require("../components/call-logs/CallLogFiltersPanel");
const Container = styled_1.default.div `
  padding: ${theme_1.theme.spacing.lg};
`;
const Table = styled_1.default.table `
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Th = styled_1.default.th `
  text-align: left;
  padding: ${theme_1.theme.spacing.md};
  border-bottom: 2px solid ${theme_1.theme.colors.background};
  color: ${theme_1.theme.colors.secondary};
  font-weight: 600;
`;
const Td = styled_1.default.td `
  padding: ${theme_1.theme.spacing.md};
  border-bottom: 1px solid ${theme_1.theme.colors.background};
`;
const ViewEventsButton = styled_1.default.button `
  background: ${theme_1.theme.colors.primary};
  color: white;
  border: none;
  padding: ${theme_1.theme.spacing.sm} ${theme_1.theme.spacing.md};
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: #4338ca;
  }
`;
const Pagination = styled_1.default.div `
  display: flex;
  justify-content: center;
  gap: ${theme_1.theme.spacing.md};
  margin-top: ${theme_1.theme.spacing.xl};
`;
const PageButton = styled_1.default.button `
  background: ${props => props.$active ? theme_1.theme.colors.primary : 'white'};
  color: ${props => props.$active ? 'white' : theme_1.theme.colors.text};
  border: 1px solid ${theme_1.theme.colors.background};
  padding: ${theme_1.theme.spacing.sm} ${theme_1.theme.spacing.md};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${props => props.$active ? theme_1.theme.colors.primary : theme_1.theme.colors.background};
  }
`;
const CallLogsPage = () => {
    const [callLogs, setCallLogs] = (0, react_1.useState)([]);
    const [totalCalls, setTotalCalls] = (0, react_1.useState)(0);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [selectedCallLog, setSelectedCallLog] = (0, react_1.useState)(null);
    const [filters, setFilters] = (0, react_1.useState)({});
    const [loading, setLoading] = (0, react_1.useState)(true);
    const ITEMS_PER_PAGE = 10;
    (0, react_1.useEffect)(() => {
        loadCallLogs();
    }, [currentPage, filters]);
    const loadCallLogs = async () => {
        try {
            setLoading(true);
            const { items, total } = await callLogService_1.callLogService.getCallLogs(filters, currentPage, ITEMS_PER_PAGE);
            setCallLogs(items);
            setTotalCalls(total);
        }
        catch (error) {
            console.error('Failed to load call logs:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const totalPages = Math.ceil(totalCalls / ITEMS_PER_PAGE);
    return (<Container>
      <h1>Call Logs</h1>

      <CallLogFiltersPanel_1.CallLogFiltersPanel filters={filters} onFiltersChange={setFilters}/>

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
          {callLogs.map(log => (<tr key={log.id}>
              <Td>{log.phoneNumberFrom}</Td>
              <Td>{log.phoneNumberTo}</Td>
              <Td>{log.ivrFlow.name}</Td>
              <Td>{(0, date_fns_1.format)(new Date(log.startTime), 'MMM d, yyyy HH:mm:ss')}</Td>
              <Td>{log.durationSeconds ? `${log.durationSeconds}s` : '-'}</Td>
              <Td>{log.status}</Td>
              <Td>{log.cost ? `$${log.cost.toFixed(2)}` : '-'}</Td>
              <Td>
                <ViewEventsButton onClick={() => setSelectedCallLog(log)}>
                  View Events
                </ViewEventsButton>
              </Td>
            </tr>))}
        </tbody>
      </Table>

      <Pagination>
        {Array.from({ length: totalPages }, (_, i) => (<PageButton key={i + 1} $active={currentPage === i + 1} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </PageButton>))}
      </Pagination>

      {selectedCallLog && (<CallLogEventModal_1.CallLogEventModal callLog={selectedCallLog} onClose={() => setSelectedCallLog(null)}/>)}
    </Container>);
};
exports.CallLogsPage = CallLogsPage;
//# sourceMappingURL=CallLogsPage.js.map