import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { theme } from '../styles/theme';
import { socketService } from '../services/socketService';
import { useAuth } from '../contexts/AuthContext';

interface ActiveCall {
  id: string;
  callSid: string;
  from: string;
  to: string;
  flowName: string;
  startTime: Date;
  currentNode: string;
  events: CallEvent[];
}

interface CallEvent {
  timestamp: Date;
  type: string;
  details: any;
}

const DashboardContainer = styled.div`
  padding: ${theme.spacing.lg};
`;

const ActiveCallsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};
`;

const CallCard = styled.div<{ $isSelected: boolean }>`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 2px solid ${props => props.$isSelected ? theme.colors.primary : 'transparent'};
  
  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const EventsContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.lg};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EventList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const EventItem = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.background};
  
  &:last-child {
    border-bottom: none;
  }
`;

const NoEvents = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.secondary};
`;

export const LiveDashboardPage = () => {
  const { user } = useAuth();
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    socketService.connect(localStorage.getItem('auth_token') || '');

    socketService.onCallStarted((data) => {
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

    socketService.onCallNodeChanged((data) => {
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

    socketService.onCallInputReceived((data) => {
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

    socketService.onCallEnded((data) => {
      setActiveCalls(prev => prev.filter(call => call.id !== data.call_log_id));
      if (selectedCallId === data.call_log_id) {
        setSelectedCallId(null);
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, [user]);

  const selectedCall = activeCalls.find(call => call.id === selectedCallId);

  return (
    <DashboardContainer>
      <h1>Live Calls</h1>
      
      <ActiveCallsGrid>
        {activeCalls.map(call => (
          <CallCard
            key={call.id}
            $isSelected={call.id === selectedCallId}
            onClick={() => setSelectedCallId(call.id)}
          >
            <h3>{call.flowName}</h3>
            <div>From: {call.from}</div>
            <div>To: {call.to}</div>
            <div>Started: {format(call.startTime, 'HH:mm:ss')}</div>
            <div>Current Node: {call.currentNode || 'Starting...'}</div>
          </CallCard>
        ))}
        {activeCalls.length === 0 && (
          <NoEvents>No active calls</NoEvents>
        )}
      </ActiveCallsGrid>

      <EventsContainer>
        <h2>Call Events</h2>
        <EventList>
          {selectedCall ? (
            selectedCall.events.map((event, index) => (
              <EventItem key={index}>
                <div>
                  <strong>{format(event.timestamp, 'HH:mm:ss')}</strong> -{' '}
                  {event.type}
                </div>
                <pre>{JSON.stringify(event.details, null, 2)}</pre>
              </EventItem>
            ))
          ) : (
            <NoEvents>Select a call to view events</NoEvents>
          )}
        </EventList>
      </EventsContainer>
    </DashboardContainer>
  );
};