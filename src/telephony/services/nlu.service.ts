import { Injectable, Logger } from '@nestjs/common';
import { DialogflowClient } from '@google-cloud/dialogflow';
import { CredentialsService } from '../../credentials/credentials.service';

export interface NLUConfig {
  projectId: string;
  sessionId: string;
  languageCode?: string;
  contexts?: string[];
}

@Injectable()
export class NLUService {
  private readonly logger = new Logger(NLUService.name);

  constructor(private credentialsService: CredentialsService) {}

  async processUtterance(
    text: string,
    nluConfig: NLUConfig,
    userId: string,
    serviceName: string,
  ): Promise<{
    intent: string;
    confidence: number;
    parameters: Record<string, any>;
    fulfillmentText: string;
  }> {
    try {
      const credentials = await this.credentialsService.getCredentials(userId, serviceName);
      const client = new DialogflowClient({ credentials });

      const [response] = await client.detectIntent({
        session: `projects/${nluConfig.projectId}/agent/sessions/${nluConfig.sessionId}`,
        queryInput: {
          text: {
            text,
            languageCode: nluConfig.languageCode || 'en-US',
          },
        },
        queryParams: {
          contexts: nluConfig.contexts?.map(context => ({
            name: `projects/${nluConfig.projectId}/agent/sessions/${nluConfig.sessionId}/contexts/${context}`,
            lifespanCount: 5,
          })),
        },
      });

      const result = response.queryResult;
      if (!result) {
        throw new Error('No NLU result');
      }

      return {
        intent: result.intent?.displayName || 'unknown',
        confidence: result.intentDetectionConfidence || 0,
        parameters: result.parameters?.fields || {},
        fulfillmentText: result.fulfillmentText || '',
      };
    } catch (error) {
      this.logger.error(`Failed to process utterance: ${error.message}`, error.stack);
      throw error;
    }
  }
}