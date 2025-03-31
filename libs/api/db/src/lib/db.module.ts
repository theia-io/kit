import { ConfigModule, ConfigService } from '@kitouch/be-config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import {
  Account,
  AccountSchema,
  AccountSettings,
  AccountSettingsSchema,
  Profile,
  ProfileSchema,
  User,
  UserSchema,
} from './schemas';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://belohadk97:ccFV9bFU5OjwrDGw@kit-dev.gz937gt.mongodb.net?retryWrites=true&w=majority',
      {
        dbName: 'kitouch',
      }
    ),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   connectionName: 'kitouch',
    //   useFactory: (configService: ConfigService) => ({
    //     uri: configService.getConfig('atlasUri'),
    //     onConnectionCreate: (connection: Connection) => {
    //       connection.on('connected', () => console.log('connected'));
    //       connection.on('open', () => console.log('open'));
    //       connection.on('disconnected', () => console.log('disconnected'));
    //       connection.on('reconnected', () => console.log('reconnected'));
    //       connection.on('disconnecting', () => console.log('disconnecting'));

    //       return connection;
    //     },
    //   }),
    // }),
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
      {
        name: AccountSettings.name,
        schema: AccountSettingsSchema,
      },
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  // exports: [],
  exports: [MongooseModule],
  controllers: [],
})
export class DbModule {}
