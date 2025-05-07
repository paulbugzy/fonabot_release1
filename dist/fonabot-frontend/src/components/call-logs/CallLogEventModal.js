"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallLogEventModal = void 0;
const react_1 = require("react");
const styled_1 = require("@emotion/styled");
const date_fns_1 = require("date-fns");
const theme_1 = require("../../styles/theme");
const callLogService_1 = require("../../services/callLogService");
const Overlay = styled_1.default.div `
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
const Modal = styled_1.default.div `
  background: white;
  border-radius: 8px;
  padding: ${theme_1.theme.spacing.xl};
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;
const Header = styled_1.default.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme_1.theme.spacing.lg};
`;
const CloseButton = styled_1.default.button `
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme_1.theme.colors.secondary};
  
  &:hover {
    color: ${theme_1.theme.colors.text};
  }
`;
const EventList = styled_1.default.div `
  display: flex;
  flex-direction: column;
  gap: ${theme_1.theme.spacing.md};
`;
const EventItem = styled_1.default.div `
  padding: ${theme_1.theme.spacing.md};
  border: 1px solid ${theme_1.theme.colors.background};
  border-radius: 4px;
`;
const EventHeader = styled_1.default.div `
  display: flex;
  justify-content: space-between;
  margin-bottom: ${theme_1.theme.spacing.sm};
`;
const EventType = styled_1.default.span `
  font-weight: 600;
  color: ${theme_1.theme.colors.primary};
`;
const EventTimestamp = styled_1.default.span `
  color: ${theme_1.theme.colors.secondary};
  font-size: 0.9rem;
`;
const EventDetails = styled_1.default.pre `
  background: ${theme_1.theme.colors.background};
  padding: ${theme_1.theme.spacing.md};
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
  margin: 0;
`;
const CallLogEventModal = ({ callLog, onClose }) => {
    const [events, setEvents] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        loadEvents();
    }, [callLog.id]);
    const loadEvents = async () => {
        try {
            setLoading(true);
            const events = await callLogService_1.callLogService.getCallLogEvents(callLog.id);
            setEvents(events);
        }
        catch (error) {
            console.error('Failed to load call events:', error);
        }
        finally {
            setLoading(false);
        }
    };
    return (<Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <h2>Call Events</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>

        <div>
          <p>From: {callLog.phoneNumberFrom}</p>
          <p>To: {callLog.phoneNumberTo}</p>
          <p>Flow: {callLog.ivrFlow.name}</p>
        </div>

        <EventList>
          {events.map(event => (<EventItem key={event.id}>
              <EventHeader>
                <EventType>
                  {event.nodeType ? `${event.nodeType} - ` : ''}
                  {event.eventType}
                </EventType>
                <EventTimestamp>
                  {(0, date_fns_1.format)(new Date(event.eventTimestamp), 'MMM d, yyyy HH:mm:ss')}
                </EventTimestamp>
              </EventHeader>
              <EventDetails>
                {JSON.stringify(event.eventDetails, null, 2)}
              </EventDetails>
            </EventItem>))}
        </EventList>
      </Modal>
    </Overlay>);
};
exports.CallLogEventModal = CallLogEventModal;
//# sourceMappingURL=CallLogEventModal.js.map