import { Module, Global } from '@nestjs/common';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService): Promise<any> => { // Return type might need adjustment based on exact versions
        const store = await redisStore({
          socket: {
            host: configService.get<string>('REDIS_HOST'),
            port: configService.get<number>('REDIS_PORT'),
          },
          password: configService.get<string>('REDIS_PASSWORD'),
          database: configService.get<number>('REDIS_DB'),
        });
        return {
          store: store as unknown as CacheStore, 
          ttl: 3600,
          isGlobal: true,
        };
      },
    }),
  ],
  // If RedisService is a custom wrapper you created, provide/export it
  // If you just want to use the standard CacheManager, you might not need RedisService here
  providers: [RedisService],
  exports: [RedisService, CacheModule],
})

export class RedisModule {}