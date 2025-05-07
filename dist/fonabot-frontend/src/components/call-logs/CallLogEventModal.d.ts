import { CallLog } from '../../services/callLogService';
interface CallLogEventModalProps {
    callLog: CallLog;
    onClose: () => void;
}
export declare const CallLogEventModal: ({ callLog, onClose }: CallLogEventModalProps) => any;
export {};
