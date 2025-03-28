import { Account, DBService, Profile, User } from '@kitouch/be-db';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('kit')
export class KitController {
  @Get('entity')
  @UseGuards(AuthGuard('jwt'))
  async getAccountUserProfiles(@Query('email') email: string) {
    let account;
    try {
      // check if will find many or INFORCE it with something
      account = await Account.findOne({ email }).exec();
    } catch (err) {
      console.log('Cannot execute account search', err);
      throw new HttpException(
        'Cannot execute account search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    if (!account) {
      throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
    }
    console.log('account', account);

    let user;
    try {
      // check if will find many or INFORCE it with something
      user = await User.findOne({ accountId: account._id });
    } catch (err) {
      throw new HttpException(
        'Cannot execute user search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    console.log('user', user);

    let profile;
    try {
      // check if will find many or INFORCE it with something
      profile = await Profile.findOne({ userId: user._id });
    } catch (err) {
      throw new HttpException(
        'Cannot execute profile search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
    }
    console.log('profile', profile);

    return {
      account,
      user,
      profile,
    };
  }
}
