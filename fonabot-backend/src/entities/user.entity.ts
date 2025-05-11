import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IvrFlow } from './ivr-flow.entity';
import { ExternalApiCredential } from './external-api-credential.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => IvrFlow, flow => flow.user)
  ivrFlows: IvrFlow[];

  @OneToMany(() => ExternalApiCredential, credential => credential.user)
  externalApiCredentials: ExternalApiCredential[];
}