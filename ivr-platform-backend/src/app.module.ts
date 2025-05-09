import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configValidationSchema } from './config/validation.schema';
import { DatabaseModule } from './database/database.module';
import { IvrFlowModule } from './ivr-flow/ivr-flow.module';
import { TelephonyModule } from './telephony/telephony.module';
import { RedisModule } from './redis/redis.module';
import { CredentialsModule } from './credentials/credentials.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: Joi.object({
        MASTER_ENCRYPTION_KEY: Joi.string().length(64).required(),
      }),
      validationOptions: {
        abortEarly: true,
      },
    }),
    DatabaseModule,
    IvrFlowModule,
    TelephonyModule,
    RedisModule,
    CredentialsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
