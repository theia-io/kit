import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KitService } from './kit.service';

@Controller('kit')
export class KitController {
  constructor(private kitService: KitService) {}

  @Get('entity')
  @UseGuards(AuthGuard('jwt'))
  async getAccountUserProfiles(@Query('email') email: string) {
    const account = await this.kitService.accountFindOne(email);
    if (!account) {
      throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.kitService.userFindOne(account.id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const profile = await this.kitService.profileFindOne(user.id);
    if (!profile) {
      throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
    }

    return {
      account,
      user,
      profile,
    };
  }
}
