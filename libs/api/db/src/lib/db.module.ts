import { ConfigModule, ConfigService } from '@kitouch/be-config';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        dbName: 'kitouch',
        uri: configService.getConfig('atlasUri'),
      }),
    }),
  ],
  exports: [MongooseModule],
  controllers: [],
})
export class DbModule {}
