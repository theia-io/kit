import { Auth0Kit, Profile as IProfile, Legal } from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { KitService } from './kit.service';

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

    return this.getAccountUserProfiles((authUser as Auth0Kit).email);
  }

  @Get('entity')
  @UseGuards(AuthGuard('jwt'))
  async getAccountUserProfiles(@Query('email') email: string) {
    const account = await this.kitService.accountByEmail(email);
    if (!account) {
      throw new HttpException('Account not found', HttpStatus.BAD_REQUEST);
    }

    const user = await this.kitService.accountUser(account.id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const profiles = await this.kitService.userProfiles(user.id);
    if (!profiles || profiles.length === 0) {
      throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
    }

    return {
      account,
      user,
      profiles,
    };
  }

  @Get('suggestion')
  @UseGuards(AuthGuard('jwt'))
  async getSuggestionProfiles(@Req() req: Request) {
    return this.kitService.suggestProfilesToFollow((req.user as Auth0Kit).user);
  }

  @Get('profiles')
  @UseGuards(AuthGuard('jwt'))
  async getProfiles(@Query('profiles') profiles: string) {
    console.log('profiles', profiles);
    return this.kitService.profiles(
      profiles.split(',').map((profile) => profile.trim())
    );
  }

  @Put('profiles')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() profile: IProfile) {
    console.log('profile', profile);
    return this.kitService.updateProfile(profile);
  }

  @Get('legal')
  @UseGuards(AuthGuard('jwt'))
  async getCompanies() {
    return this.kitService.companies();
  }

  @Post('legal')
  @UseGuards(AuthGuard('jwt'))
  async addCompany(@Body() companies: Array<Pick<Legal, 'alias' | 'name'>>) {
    return this.kitService.addCompanies(companies);
  }
}
