import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { format } from "date-fns";
import { theme } from "../../styles/theme";
import type { CallLog, CallLogEvent } from "../../services/callLogService";
import { callLogService } from "../../services/callLogService";

const Overlay = styled.div`
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

const Modal = styled.div`
  background: white;
  border-radius: 8px;
  padding: ${theme.spacing.xl};
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

const Header = styled.div`
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

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const EventItem = styled.div`
  padding: ${theme.spacing.md};
  border: 1px solid ${theme.colors.background};
  border-radius: 4px;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.sm};
`;

const EventType = styled.span`
  font-weight: 600;
  color: ${theme.colors.primary};
`;

const EventTimestamp = styled.span`
  color: ${theme.colors.secondary};
  font-size: 0.9rem;
`;

const EventDetails = styled.pre`
  background: ${theme.colors.background};
  padding: ${theme.spacing.md};
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
  margin: 0;
`;

interface CallLogEventModalProps {
  callLog: CallLog;
  onClose: () => void;
}

export const CallLogEventModal = ({
  callLog,
  onClose
}: CallLogEventModalProps) => {
  const [events, setEvents] = useState<CallLogEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [callLog.id]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const events = await callLogService.getCallLogEvents(callLog.id);
      setEvents(events);
    } catch (error) {
      console.error("Failed to load call events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <h2>Call Events {isLoading && "(Loading...)"}</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <div>
          <p>From: {callLog.phoneNumberFrom}</p>
          <p>To: {callLog.phoneNumberTo}</p>
          <p>Flow: {callLog.ivrFlow.name}</p>
        </div>

        <EventList>
          {events.map((event) => (
            <EventItem key={event.id}>
              <EventHeader>
                <EventType>
                  {event.nodeType ? `${event.nodeType} - ` : ""}
                  {event.eventType}
                </EventType>
                <EventTimestamp>
                  {format(
                    new Date(event.eventTimestamp),
                    "MMM d, yyyy HH:mm:ss"
                  )}
                </EventTimestamp>
              </EventHeader>
              <EventDetails>
                {JSON.stringify(event.eventDetails, null, 2)}
              </EventDetails>
            </EventItem>
          ))}
        </EventList>
      </Modal>
    </Overlay>
  );
};
