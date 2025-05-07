import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { ExternalApiCredential } from '../entities/external-api-credential.entity';

@Injectable()
export class CredentialsService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly masterKey: Buffer;

  constructor(
    @InjectRepository(ExternalApiCredential)
    private credentialsRepository: Repository<ExternalApiCredential>,
    private configService: ConfigService,
  ) {
    const key = this.configService.get<string>('MASTER_ENCRYPTION_KEY');
    if (!key) {
      throw new Error('MASTER_ENCRYPTION_KEY not configured');
    }
    this.masterKey = Buffer.from(key, 'hex');
  }

  private encrypt(text: string): { encrypted: string; iv: string } {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.masterKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
      encrypted: encrypted.toString('hex'),
      iv: iv.toString('hex'),
    };
  }

  private decrypt(encrypted: string, iv: string): string {
    const decipher = createDecipheriv(
      this.algorithm,
      this.masterKey,
      Buffer.from(iv, 'hex'),
    );
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, 'hex')),
      decipher.final(),
    ]);
    return decrypted.toString();
  }

  async getCredentials(userId: string, serviceName: string): Promise<any> {
    const credential = await this.credentialsRepository.findOne({
      where: { userId, serviceName },
    });

    if (!credential) {
      throw new NotFoundException(
        `Credentials not found for service: ${serviceName}`,
      );
    }

    const [encrypted, iv] = credential.credentialsEncrypted.split(':');
    const decrypted = this.decrypt(encrypted, iv);
    return JSON.parse(decrypted);
  }

  async saveCredentials(
    userId: string,
    serviceName: string,
    credentials: any,
  ): Promise<void> {
    const { encrypted, iv } = this.encrypt(JSON.stringify(credentials));
    const credentialsEncrypted = `${encrypted}:${iv}`;

    await this.credentialsRepository.save({
      userId,
      serviceName,
      credentialsEncrypted,
    });
  }
}