import { DbModule } from '@kitouch/be-db';
import { Module } from '@nestjs/common';
import { KitController } from './kit.controller';
import { KitService } from './kit.service';

@Module({
  imports: [
    DbModule,
    // MongooseModule.forFeature([
    //   {
    //     name: Account.name,
    //     schema: AccountSchema,
    //   },
    //   {
    //     name: AccountSettings.name,
    //     schema: AccountSettingsSchema,
    //   },
    //   {
    //     name: Profile.name,
    //     schema: ProfileSchema,
    //   },
    //   {
    //     name: User.name,
    //     schema: UserSchema,
    //   },
    // ]),
  ],
  controllers: [KitController],
  providers: [KitService],
  exports: [
    KitService,
    // Account,
    // AccountSettings,
    // Profile,
    // User
  ],
})
export class KitModule {}
