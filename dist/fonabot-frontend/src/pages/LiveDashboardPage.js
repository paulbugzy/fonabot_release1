"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveDashboardPage = void 0;
const react_1 = require("react");
const styled_1 = require("@emotion/styled");
const date_fns_1 = require("date-fns");
const theme_1 = require("../styles/theme");
const socketService_1 = require("../services/socketService");
const AuthContext_1 = require("../contexts/AuthContext");
const DashboardContainer = styled_1.default.div `
  padding: ${theme_1.theme.spacing.lg};
`;
const ActiveCallsGrid = styled_1.default.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme_1.theme.spacing.lg};
  margin-bottom: ${theme_1.theme.spacing.xl};
`;
const CallCard = styled_1.default.div `
  background: white;
  border-radius: 8px;
  padding: ${theme_1.theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 2px solid ${props => props.$isSelected ? theme_1.theme.colors.primary : 'transparent'};
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;
const EventsContainer = styled_1.default.div `
  background: white;
  border-radius: 8px;
  padding: ${theme_1.theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const EventList = styled_1.default.div `
  max-height: 400px;
  overflow-y: auto;
`;
const EventItem = styled_1.default.div `
  padding: ${theme_1.theme.spacing.md};
  border-bottom: 1px solid ${theme_1.theme.colors.background};
  
  &:last-child {
    border-bottom: none;
  }
`;
const NoEvents = styled_1.default.div `
  text-align: center;
  padding: ${theme_1.theme.spacing.xl};
  color: ${theme_1.theme.colors.secondary};
`;
const LiveDashboardPage = () => {
    const { user } = (0, AuthContext_1.useAuth)();
    const [activeCalls, setActiveCalls] = (0, react_1.useState)([]);
    const [selectedCallId, setSelectedCallId] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (!user)
            return;
        socketService_1.socketService.connect(localStorage.getItem('auth_token') || '');
        socketService_1.socketService.onCallStarted((data) => {
            setActiveCalls(prev => [...prev, {
                    id: data.call_log_id,
                    callSid: data.provider_call_sid,
                    from: data.phone_number_from,
                    to: data.phone_number_to,
                    flowName: data.ivr_flow_name,
                    startTime: new Date(),
                    currentNode: '',
                    events: [{
                            timestamp: new Date(),
                            type: 'call_started',
                            details: data
                        }]
                }]);
        });
        socketService_1.socketService.onCallNodeChanged((data) => {
            setActiveCalls(prev => prev.map(call => {
                if (call.id === data.call_log_id) {
                    return {
                        ...call,
                        currentNode: data.node_type,
                        events: [...call.events, {
                                timestamp: new Date(),
                                type: 'node_changed',
                                details: data
                            }]
                    };
                }
                return call;
            }));
        });
        socketService_1.socketService.onCallInputReceived((data) => {
            setActiveCalls(prev => prev.map(call => {
                if (call.id === data.call_log_id) {
                    return {
                        ...call,
                        events: [...call.events, {
                                timestamp: new Date(),
                                type: 'input_received',
                                details: data
                            }]
                    };
                }
                return call;
            }));
        });
        socketService_1.socketService.onCallEnded((data) => {
            setActiveCalls(prev => prev.filter(call => call.id !== data.call_log_id));
            if (selectedCallId === data.call_log_id) {
                setSelectedCallId(null);
            }
        });
        return () => {
            socketService_1.socketService.disconnect();
        };
    }, [user]);
    const selectedCall = activeCalls.find(call => call.id === selectedCallId);
    return (<DashboardContainer>
      <h1>Live Calls</h1>
      
      <ActiveCallsGrid>
        {activeCalls.map(call => (<CallCard key={call.id} $isSelected={call.id === selectedCallId} onClick={() => setSelectedCallId(call.id)}>
            <h3>{call.flowName}</h3>
            <div>From: {call.from}</div>
            <div>To: {call.to}</div>
            <div>Started: {(0, date_fns_1.format)(call.startTime, 'HH:mm:ss')}</div>
            <div>Current Node: {call.currentNode || 'Starting...'}</div>
          </CallCard>))}
        {activeCalls.length === 0 && (<NoEvents>No active calls</NoEvents>)}
      </ActiveCallsGrid>

      <EventsContainer>
        <h2>Call Events</h2>
        <EventList>
          {selectedCall ? (selectedCall.events.map((event, index) => (<EventItem key={index}>
                <div>
                  <strong>{(0, date_fns_1.format)(event.timestamp, 'HH:mm:ss')}</strong> -{' '}
                  {event.type}
                </div>
                <pre>{JSON.stringify(event.details, null, 2)}</pre>
              </EventItem>))) : (<NoEvents>Select a call to view events</NoEvents>)}
        </EventList>
      </EventsContainer>
    </DashboardContainer>);
};
exports.LiveDashboardPage = LiveDashboardPage;
//# sourceMappingURL=LiveDashboardPage.js.map