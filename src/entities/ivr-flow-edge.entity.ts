import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IvrFlow } from './ivr-flow.entity';

@Entity('ivr_flow_edges')
export class IvrFlowEdge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'ivr_flow_id' })
  ivrFlowId: string;

  @Column({ name: 'edge_client_id' })
  edgeClientId: string;

  @Column({ name: 'source_node_client_id' })
  sourceNodeClientId: string;

  @Column({ name: 'target_node_client_id' })
  targetNodeClientId: string;

  @Column({ name: 'source_handle', nullable: true })
  sourceHandle: string;

  @Column({ name: 'target_handle', nullable: true })
  targetHandle: string;

  @Column({ type: 'jsonb', default: '{}' })
  properties: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => IvrFlow, flow => flow.edges)
  @JoinColumn({ name: 'ivr_flow_id' })
  ivrFlow: IvrFlow;
}