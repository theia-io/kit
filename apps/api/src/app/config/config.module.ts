import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { ConfigOptionsToken, EnvConfig } from './type';

@Module({})
export class ConfigModule {
  static register(options: Record<string, EnvConfig>): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigOptionsToken,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
