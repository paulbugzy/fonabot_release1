import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { CallLog } from './call-log.entity';

@Entity('call_log_events')
export class CallLogEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'call_log_id' })
  callLogId: string;

  @CreateDateColumn({ name: 'event_timestamp' })
  eventTimestamp: Date;

  @Column({ name: 'node_client_id', nullable: true })
  nodeClientId: string;

  @Column({ name: 'node_type', nullable: true })
  nodeType: string;

  @Column({ name: 'event_type' })
  eventType: string;

  @Column({ type: 'jsonb', default: '{}' })
  eventDetails: Record<string, any>;

  @ManyToOne(() => CallLog, log => log.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'call_log_id' })
  callLog: CallLog;
}