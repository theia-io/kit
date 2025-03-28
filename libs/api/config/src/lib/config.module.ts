import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Environment, EnvironmentToken } from './type';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(environment: Environment): DynamicModule {
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
