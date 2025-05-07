import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialsService } from './credentials.service';
import { ExternalApiCredential } from '../entities/external-api-credential.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExternalApiCredential])],
  providers: [CredentialsService],
  exports: [CredentialsService],
})