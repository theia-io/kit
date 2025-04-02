import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { KitService } from './kit.service';
import { Request } from 'express';
import { Auth0User } from '@kitouch/shared-models';

@Controller('kit')
export class KitController {
  constructor(private kitService: KitService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async resolveSessionAccountUserProfiles(@Req() req: Request) {
    const authUser = req.user;
    if (!authUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    return this.getAccountUserProfiles((authUser as Auth0User).email);
  }

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

    const profiles = await this.kitService.profileFind(user.id);
    if (!profiles || profiles.length === 0) {
      throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
    }

    const profilesUpd = profiles.map((profile) => profile.toJSON());
    console.log(
      'ACCOUNT:USER:PROFILE ids',
      account.id,
      account._id,
      user.id,
      user._id,
      profilesUpd
    );
    profilesUpd.forEach((profileUp) => console.log(profileUp));

    return {
      account,
      user,
      profiles,
    };
  }
}
