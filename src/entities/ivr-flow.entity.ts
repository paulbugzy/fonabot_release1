import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { IvrFlowNode } from './ivr-flow-node.entity';
import { IvrFlowEdge } from './ivr-flow-edge.entity';

@Entity('ivr_flows')
export class IvrFlow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'trigger_phone_number', nullable: true, unique: true })
  triggerPhoneNumber: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.ivrFlows)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => IvrFlowNode, node => node.ivrFlow)
  nodes: IvrFlowNode[];

  @OneToMany(() => IvrFlowEdge, edge => edge.ivrFlow)
  edges: IvrFlowEdge[];
}