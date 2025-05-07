import { Injectable, Logger } from '@nestjs/common';
import { SpeechClient } from '@google-cloud/speech';
import { CredentialsService } from '../../credentials/credentials.service';

export interface ASRConfig {
  languageCode?: string;
  model?: string;
  hints?: string[];
  profanityFilter?: boolean;
  singleUtterance?: boolean;
}

@Injectable()
export class ASRService {
  private readonly logger = new Logger(ASRService.name);

  constructor(private credentialsService: CredentialsService) {}

  async recognizeSpeech(
    audioUrl: string,
    asrConfig: ASRConfig,
    userId: string,
    serviceName: string,
  ): Promise<{ transcript: string; confidence: number }> {
    try {
      const credentials = await this.credentialsService.getCredentials(userId, serviceName);
      const client = new SpeechClient({ credentials });

      const [response] = await client.recognize({
        audio: { uri: audioUrl },
        config: {
          languageCode: asrConfig.languageCode || 'en-US',
          model: asrConfig.model || 'phone_call',
          speechContexts: asrConfig.hints ? [{
            phrases: asrConfig.hints
          }] : undefined,
          profanityFilter: asrConfig.profanityFilter ?? true,
        },
      });

      const result = response.results[0];
      if (!result?.alternatives[0]) {
        throw new Error('No speech recognition result');
      }

      return {
        transcript: result.alternatives[0].transcript,
        confidence: result.alternatives[0].confidence || 0,
      };
    } catch (error) {
      this.logger.error(`Failed to recognize speech: ${error.message}`, error.stack);
      throw error;
    }
  }
}