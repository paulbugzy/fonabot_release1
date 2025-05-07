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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make config module available everywhere
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: configValidationSchema,
      validationOptions: {
        abortEarly: true, // Stops validation after the first error
      },
    }),
    DatabaseModule,
    IvrFlowModule,
    TelephonyModule,
    RedisModule,
    CredentialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}