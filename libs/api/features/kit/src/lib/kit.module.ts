import {
  Account,
  AccountSchema,
  AccountSettings,
  AccountSettingsSchema,
  DbModule,
  Profile,
  ProfileSchema,
  User,
  UserSchema,
} from '@kitouch/be-db';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { KitController } from './kit.controller';
import { KitService } from './kit.service';
import { Legal, LegalSchema } from './schemas';

@Module({
  imports: [
    DbModule,
    MongooseModule.forFeatureAsync([
      {
        name: Account.name,
        useFactory: () => AccountSchema,
      },
      {
        name: AccountSettings.name,
        useFactory: () => AccountSettingsSchema,
      },
      {
        name: Profile.name,
        useFactory: () => ProfileSchema,
      },
      {
        name: User.name,
        useFactory: () => UserSchema,
      },
      {
        name: Legal.name,
        useFactory: () => LegalSchema,
      },
    ]),
  ],
  controllers: [KitController],
  providers: [KitService],
  exports: [KitService],
})
export class KitModule {}
