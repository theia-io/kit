import { OptionalJwtAuthGuard } from '@kitouch/be-auth';
import {
  Auth0Kit,
  Experience,
  Profile as IProfile,
  Legal,
} from '@kitouch/shared-models';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
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
  @UseGuards(OptionalJwtAuthGuard)
  async resolveSessionAccountUserProfiles(@Req() req: Request) {
    const authUser = req.user;

    const isAuthenticated = (req as any).oidc?.isAuthenticated();
    console.log('(req as any).oidc?.isAuthenticated');
    console.log(isAuthenticated);

    if (isAuthenticated && !authUser) {
      throw new HttpException(
        'Redirect to auth provider',
        HttpStatus.PRECONDITION_REQUIRED
      );
    }

    if (!authUser) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
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

  @Delete('entity/:accountId')
  @UseGuards(AuthGuard('jwt'))
  async deleteAccountUserProfiles(@Param('accountId') accountId: string) {
    const account = await this.kitService.deleteAccount(accountId);
    if (!account) {
      throw new HttpException(
        'Account was not deleted',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const user = await this.kitService.accountUser(accountId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const profiles = await this.kitService.userProfiles(user.id);
    if (!profiles || profiles.length === 0) {
      throw new HttpException('Profile not found', HttpStatus.BAD_REQUEST);
    }

    return true;
  }

  @Get('suggestion')
  @UseGuards(AuthGuard('jwt'))
  async getSuggestionProfiles(@Req() req: Request) {
    return this.kitService.suggestProfilesToFollow((req.user as Auth0Kit).user);
  }

  @Get('profiles')
  @UseGuards(AuthGuard('jwt'))
  async getProfiles(@Query('profiles') profiles: string) {
    return this.kitService.profiles(
      profiles.split(',').map((profile) => profile.trim())
    );
  }

  @Put('profiles')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() profile: IProfile) {
    return this.kitService.updateProfile(profile);
  }

  @Get('user/:usedId')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Param('usedId') id: string) {
    return this.kitService.getUser(id);
  }

  @Put('user/:usedId/experience')
  @UseGuards(AuthGuard('jwt'))
  async addUserExperience(
    @Param('usedId') userId: string,
    @Body() experience: Experience
  ) {
    return this.kitService.addUserExperience(userId, experience);
  }

  @Delete('user/:usedId/experience/:experienceId')
  @UseGuards(AuthGuard('jwt'))
  async deleteUserExperience(
    @Param('usedId') userId: string,
    @Param('experienceId') experienceId: string
  ) {
    return this.kitService.deleteUserExperience(userId, experienceId);
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
