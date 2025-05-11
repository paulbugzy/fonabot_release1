// ivr-platform-backend/src/credentials/credentials.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

@Injectable()
export class CredentialsService {
  private readonly masterKey: Buffer;
  private readonly logger = new Logger(CredentialsService.name);

  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get<string>('MASTER_ENCRYPTION_KEY');
    if (!key) {
      this.logger.error('MASTER_ENCRYPTION_KEY is not defined.');
      throw new Error(
        'MASTER_ENCRYPTION_KEY must be defined for encryption services.',
      );
    }
    // Ensure the key is 32 bytes for AES-256.
    // If your key is hex-encoded, use Buffer.from(key, 'hex')
    // If your key is a 32-character string intended to be used directly as bytes,
    // ensure it's treated consistently. For simplicity, assuming utf-8 gives 32 bytes.
    // A more robust approach is to expect a hex or base64 encoded key of appropriate length.
    this.masterKey = Buffer.from(key, 'utf-8');
    if (this.masterKey.length !== 32) {
      this.logger.error(
        `MASTER_ENCRYPTION_KEY, after Buffer.from(key, 'utf-8'), is not 32 bytes. Length: ${this.masterKey.length}. Ensure your key provides 32 bytes for AES-256.`,
      );
      throw new Error(
        'Invalid MASTER_ENCRYPTION_KEY length. Must be 32 bytes for AES-256.',
      );
    }
  }

  encrypt(text: string): string {
    if (!text) return text;
    try {
      const iv = crypto.randomBytes(IV_LENGTH);
      const cipher = crypto.createCipheriv(ALGORITHM, this.masterKey, iv);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      // Prepend IV for use in decryption
      return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
      this.logger.error('Encryption failed', error.stack);
      throw new Error('Encryption process failed.');
    }
  }

  decrypt(encryptedTextWithIv: string): string {
    if (!encryptedTextWithIv) return encryptedTextWithIv;
    try {
      const parts = encryptedTextWithIv.split(':');
      if (parts.length !== 2) {
        this.logger.error('Encrypted text does not contain IV separator ":"');
        throw new Error('Invalid encrypted text format.');
      }
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = parts[1];

      if (iv.length !== IV_LENGTH) {
        this.logger.error(
          `Extracted IV length is incorrect. Expected ${IV_LENGTH}, got ${iv.length}`,
        );
        throw new Error('Invalid IV length during decryption.');
      }

      const decipher = crypto.createDecipheriv(ALGORITHM, this.masterKey, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      this.logger.error('Decryption failed', error.stack);
      // Avoid leaking error details that might help attackers.
      // Depending on context, you might return null, empty string, or throw a generic error.
      throw new Error('Decryption process failed.');
    }
  }
}
