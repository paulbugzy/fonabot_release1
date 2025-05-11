import { ClassSerializerInterceptor, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomClassSerializerInterceptor extends ClassSerializerInterceptor {
  constructor(configService: ConfigService) {
    super({
      // You can add custom options here
      excludeExtraneousValues: true,
    });
  }
}