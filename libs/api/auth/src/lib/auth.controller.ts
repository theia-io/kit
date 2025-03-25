/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('test')
  test(@Req() req: Request) {
    console.log('TEST reached', (req as any).oidc.user);
    return {
      message:
        'test, time:' +
        new Date().toISOString() +
        '; user' +
        (req as any).oidc.user,
    };
  }

  // @Get('login')
  // @UseGuards(AuthGuard('auth0'))
  // login() {
  //   // Handled by auth0
  // }

  @Get('callback')
  // @UseGuards(AuthGuard('auth0'))
  // @Redirect()
  async authCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    console.log('AUTH LOGIN CB', (req as any).oidc.user);

    if (!(req as any).oidc?.isAuthenticated()) {
      // Use oidc.isAuthenticated()
      throw new Error('Authentication failed');
    }
    // req.oidc.user contains user information from Auth0
    const token = await this.authService.generateJWT((req as any).oidc.user);

    (res as any).cookie('jwt', token, {
      httpOnly: true,
      secure: process.env?.['NODE_ENV'] === 'production',
      maxAge: 3600 * 1000,
      sameSite: false, //'strict',
      path: '/',
    });

    return { url: '/api/auth/profile' }; // Redirect to frontend
  }

  @Get('logout')
  @Redirect()
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    console.log('AUTH LOGOUT', (req as any).oidc.user);

    // Clear cookie
    (res as any).clearCookie('jwt');

    const logoutUrl = new URL(
      `https://${process.env?.['AUTH0_DOMAIN']}/v2/logout`
    );
    logoutUrl.searchParams.set('client_id', process.env?.['AUTH0_CLIENT_ID']!);
    logoutUrl.searchParams.set('returnTo', process.env?.['AUTH0_BASE_URL']!); //important

    return { url: logoutUrl.toString() };
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: any) {
    console.log('controller profile', req.user);

    return req.user; // Contains the Auth0 user ID (sub) and any other claims you added
  }
}
