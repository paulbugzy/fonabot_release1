import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class CustomClassSerializerInterceptor extends ClassSerializerInterceptor {
    constructor(configService: ConfigService);
}
