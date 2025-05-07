import { CallLogFilters } from '../../services/callLogService';
interface CallLogFiltersPanelProps {
    filters: CallLogFilters;
    onFiltersChange: (filters: CallLogFilters) => void;
}
export declare const CallLogFiltersPanel: ({ filters, onFiltersChange }: CallLogFiltersPanelProps) => any;
export {};
