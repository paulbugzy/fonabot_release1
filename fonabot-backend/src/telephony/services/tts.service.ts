import { Injectable, Logger } from '@nestjs/common';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import { CredentialsService } from '../../credentials/credentials.service';

export interface TTSConfig {
  voice?: {
    languageCode?: string;
    name?: string;
    ssmlGender?: 'NEUTRAL' | 'MALE' | 'FEMALE';
  };
  audioConfig?: {
    audioEncoding?: 'LINEAR16' | 'MP3' | 'OGG_OPUS';
    speakingRate?: number;
    pitch?: number;
    volumeGainDb?: number;
  };
}

@Injectable()
export class TTSService {
  private readonly logger = new Logger(TTSService.name);
  private readonly cache = new Map<string, string>();

  constructor(private credentialsService: CredentialsService) {}

  private generateCacheKey(text: string, config: TTSConfig): string {
    return `${text}:${JSON.stringify(config)}`;
  }

  async synthesizeSpeech(
    text: string,
    ttsConfig: TTSConfig,
    userId: string,
    serviceName: string,
  ): Promise<string> {
    const cacheKey = this.generateCacheKey(text, ttsConfig);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const credentials = await this.credentialsService.getCredentials(userId, serviceName);
      const client = new TextToSpeechClient({ credentials });

      const [response] = await client.synthesizeSpeech({
        input: { text },
        voice: {
          languageCode: ttsConfig.voice?.languageCode || 'en-US',
          name: ttsConfig.voice?.name || 'en-US-Standard-A',
          ssmlGender: ttsConfig.voice?.ssmlGender || 'NEUTRAL',
        },
        audioConfig: {
          audioEncoding: ttsConfig.audioConfig?.audioEncoding || 'MP3',
          speakingRate: ttsConfig.audioConfig?.speakingRate || 1.0,
          pitch: ttsConfig.audioConfig?.pitch || 0,
          volumeGainDb: ttsConfig.audioConfig?.volumeGainDb || 0,
        },
      });

      // In a real implementation, you would:
      // 1. Upload the audio buffer to cloud storage
      // 2. Return the public URL
      // For this example, we'll return a placeholder URL
      const audioUrl = `https://storage.googleapis.com/tts-audio/${cacheKey}.mp3`;
      this.cache.set(cacheKey, audioUrl);

      return audioUrl;
    } catch (error) {
      this.logger.error(`Failed to synthesize speech: ${error.message}`, error.stack);
      throw error;
    }
  }
}