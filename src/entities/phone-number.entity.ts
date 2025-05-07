import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { IvrFlow } from './ivr-flow.entity';

@Entity('phone_numbers')
export class PhoneNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'phone_number', unique: true })
  phoneNumber: string;

  @Column()
  provider: string;

  @Column({ name: 'provider_number_sid', nullable: true, unique: true })
  providerNumberSid: string;

  @Column({ type: 'jsonb', default: '{"voice": false, "sms": false, "mms": false}' })
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };

  @Column({ name: 'assigned_ivr_flow_id', nullable: true })
  assignedIvrFlowId: string;

  @Column({ name: 'webhook_url_voice', nullable: true })
  webhookUrlVoice: string;

  @Column({ name: 'webhook_url_status_callback', nullable: true })
  webhookUrlStatusCallback: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => IvrFlow, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_ivr_flow_id' })
  assignedIvrFlow: IvrFlow;
}