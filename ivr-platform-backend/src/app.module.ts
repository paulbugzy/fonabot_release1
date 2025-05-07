import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configValidationSchema } from './config/validation.schema';
import { DatabaseModule } from './database/database.module';
import { IvrFlowModule } from './ivr-flow/ivr-flow.module';
import { TelephonyModule } from './telephony/telephony.module';
import { CredentialsModule } from './credentials/credentials.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    DatabaseModule,
    IvrFlowModule,
    TelephonyModule,
    CredentialsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}