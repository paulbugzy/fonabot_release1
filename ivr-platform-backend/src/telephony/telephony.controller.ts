import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { TwilioTelephonyService } from './twilio.service';

class MakeTestCallDto {
  phoneNumber: string;
  message: string;
}

@Controller('telephony')
@UseGuards(JwtAuthGuard)
export class TelephonyController {
  constructor(private telephonyService: TwilioTelephonyService) {}

  @Post('test-call')
  async makeTestCall(
    @GetUser() userId: string,
    @Body() dto: MakeTestCallDto,
  ) {
    const callSid = await this.telephonyService.makeTestCall(
      userId,
      dto.phoneNumber,
      dto.message,
    );
    return { callSid };
  }
}