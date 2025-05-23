import { ConfigService } from '@kitouch/be-config';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { OptionalJwtAuthGuard } from './optional-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private configService: ConfigService) {}

  @Get('logout')
  @UseGuards(OptionalJwtAuthGuard)
  // @Redirect() // We will redirect to Auth0 logout
  logout(@Req() req: Request, @Res() res: Response) {
    console.info(
      '[AuthController][logout] Executing app-logout: Clearing JWT cookie...'
    );

    const isProduction = this.configService.getEnvironment('production');
    const domainBase = isProduction ? '.kitouch.io' : undefined;

    // 1. Clear your application's JWT cookie
    res.clearCookie('jwt', {
      domain: domainBase,
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'lax' : false,
      path: '/',
    });

    const feUrl = this.configService.getEnvironment('feUrl');

    if ((res as any).oidc && typeof (res as any).oidc.logout === 'function') {
      (res as any).oidc.logout({
        logoutParams: {
          // For express-openid-connect v2.x+
          returnTo: feUrl,
        },
      });
      // IMPORTANT: res.oidc.logout() sends the response. Do not try to send another response after this.
    } else {
      res.redirect(feUrl || '/');
    }

    // --- ADD DELAY HERE ---
    // console.log('DELAYING FOR 1 SECOND...');
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000 ms = 1 second
    // console.log('DELAYED FOR 1 SECOND...');
    // --- END DELAY ---

    // 2. Construct the Auth0 logout URL
    // const logoutUrl = new URL(
    //   `${this.configService.getConfig('auth').issuerBaseUrl}/v2/logout`
    // );
    // const searchString = new URLSearchParams({
    //   client_id: this.configService.getConfig('auth').clientId,
    //   // returnTo tells Auth0 where to send the user *after* Auth0 logout is complete
    //   //   returnTo: this.configService.get<string>('AUTH0_BASE_URL')!, // Send back to backend base, which might then redirect home
    //   // Or redirect directly to a frontend "logged out" page:
    //   returnTo: this.configService.getEnvironment('feUrl'),
    // });
    // logoutUrl.search = searchString.toString();

    // console.info(
    //   '[AuthController][logout] Redirecting to Auth0 logout:',
    //   logoutUrl.toString()
    // );

    // // 3. Redirect the browser to Auth0 logout
    // return { url: logoutUrl.toString() };
  }
}
