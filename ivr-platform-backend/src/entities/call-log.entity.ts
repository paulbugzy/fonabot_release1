import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { IvrFlow } from './ivr-flow.entity';
import { CallLogEvent } from './call-log-event.entity';

@Entity('call_logs')
export class CallLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'provider_call_sid' })
  providerCallSid: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'ivr_flow_id', nullable: true })
  ivrFlowId: string;

  @Column({ name: 'phone_number_from' })
  phoneNumberFrom: string;

  @Column({ name: 'phone_number_to' })
  phoneNumberTo: string;

  @Column({ name: 'start_time' })
  startTime: Date;

  @Column({ name: 'end_time', nullable: true })
  endTime: Date;

  @Column({ name: 'duration_seconds', nullable: true })
  durationSeconds: number;

  @Column()
  status: string;

  @Column({ name: 'disposition_details', nullable: true })
  dispositionDetails: string;

  @Column({ name: 'call_transcript_summary', nullable: true })
  callTranscriptSummary: string;

  @Column({ type: 'decimal', precision: 10, scale: 5, nullable: true })
  cost: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => IvrFlow, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ivr_flow_id' })
  ivrFlow: IvrFlow;

  @OneToMany(() => CallLogEvent, event => event.callLog)
  events: CallLogEvent[];
}