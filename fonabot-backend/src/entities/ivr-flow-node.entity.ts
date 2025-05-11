import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IvrFlow } from './ivr-flow.entity';

@Entity('ivr_flow_nodes')
export class IvrFlowNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ivr_flow_id' })
  ivrFlowId: string;

  @Column({ name: 'node_client_id' })
  nodeClientId: string;

  @Column()
  type: string;

  @Column({ name: 'position_x', default: 0 })
  positionX: number;

  @Column({ name: 'position_y', default: 0 })
  positionY: number;

  @Column({ type: 'jsonb', default: '{}' })
  properties: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => IvrFlow, flow => flow.nodes)
  @JoinColumn({ name: 'ivr_flow_id' })
  ivrFlow: IvrFlow;
}