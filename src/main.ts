import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import * as helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ValidationInterceptor } from './common/interceptors/validation.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Get config service
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());
  app.enableCors({
    origin: configService.get('ALLOWED_ORIGINS', '').split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  
  // Set global prefix (optional)
  app.setGlobalPrefix('api');
  
  // Enable validation pipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert primitive types automatically
      },
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }
    )
    new LoggingInterceptor(),
    new ValidationInterceptor()
  );
  
  // Enable class serialization globally
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(ConfigService)));
  
  // Add logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Add global exception filter
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // Get port from environment variables or use default
  const port = configService.get<number>('PORT', 3000);
  
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();