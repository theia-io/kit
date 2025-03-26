import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Environment, EnvironmentToken } from './type';

@Module({})
export class ConfigModule {
  static register(environment: Environment): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: EnvironmentToken,
          useValue: environment,
        },
        ConfigService,
      ],
      exports: [ConfigService, EnvironmentToken],
    };
  }
}
