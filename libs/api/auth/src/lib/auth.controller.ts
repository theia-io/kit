/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  login(@Res() res: Response) {
    (res as any).oidc.login({
      returnTo: 'http://localhost:4200', // Where to go after successful login *on the frontend*
      authorizationParams: {
        redirect_uri: 'http://localhost:3000/api/auth/callback',
      },
    });
  }

  @Post('callback')
  @Redirect()
  async authCallbackPost(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const { id_token } = (req.body as any) ?? {};
    if (!id_token) {
      throw new BadRequestException('Auth0 flow login error, try later.');
    }

    const token = await this.authService.generateJwtToken(id_token);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: false, // process.env?.['NODE_ENV'] === 'production',
      maxAge: 3600 * 1000,
      sameSite: false, // 'strict',
      path: '/',
    });

    return { url: 'http://localhost:4200/s/redirect-auth0' };
  }

  @Get('logout')
  @Redirect()
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    // Clear cookie
    res.clearCookie('jwt');

    const logoutUrl = new URL(`${process.env?.['AUTH0_DOMAIN']}/v2/logout`);
    logoutUrl.searchParams.set('client_id', process.env?.['AUTH0_CLIENT_ID']!);
    logoutUrl.searchParams.set('returnTo', process.env?.['BASE_URL']!);

    return { url: logoutUrl.toString() };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    return req.user; // Contains the Auth0 user ID (sub) and any other claims you added
  }
}
