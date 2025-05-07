import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IvrFlow } from './ivr-flow.entity';

@Entity('call_sessions')
export class CallSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_call_sid', unique: true })
  providerCallSid: string;

  @Column({ name: 'ivr_flow_id', nullable: true })
  ivrFlowId: string;

  @Column({ name: 'phone_number_from' })
  phoneNumberFrom: string;

  @Column({ name: 'phone_number_to' })
  phoneNumberTo: string;

  @Column({ default: 'initiated' })
  status: string;

  @Column({ name: 'current_node_client_id', nullable: true })
  currentNodeClientId: string;

  @Column({ type: 'jsonb', default: '{}' })
  variables: Record<string, any>;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'last_activity_time' })
  lastActivityTime: Date;

  @Column({ name: 'end_time', nullable: true })
  endTime: Date;

  @Column({ name: 'error_message', nullable: true })
  errorMessage: string;

  @ManyToOne(() => IvrFlow, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ivr_flow_id' })
  ivrFlow: IvrFlow;
}