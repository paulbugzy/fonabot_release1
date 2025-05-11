import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('external_api_credentials')
export class ExternalApiCredential {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'service_name' })
  serviceName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ name: 'credentials_encrypted' })
  credentialsEncrypted: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, user => user.externalApiCredentials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}