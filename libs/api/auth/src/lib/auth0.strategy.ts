import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-auth0';
import { AuthService } from './auth.service';

@Injectable()
export class Auth0Strategy extends PassportStrategy(Strategy, 'auth0') {
  constructor(private authService: AuthService) {
    const domain = process.env['AUTH0_DOMAIN'],
      clientID = process.env['AUTH0_CLIENT_ID'],
      clientSecret = process.env['AUTH0_CLIENT_SECRET'],
      callbackURL = process.env['AUTH0_CALLBACK_URL'],
      audience = process.env['AUTH0_AUDIENCE'];

    if (!domain || !clientID || !clientSecret || !callbackURL) {
      throw new Error('Auth0 was not configured properly');
      return;
    }

    super({
      // passReqToCallback: true,
      domain,
      clientID,
      clientSecret,
      callbackURL,
      state: true,
      // audience,
    });
  }

  // Simplified validate method - just return the profile
  async validate(
    accessToken: string,
    refreshToken: string,
    extraParams: any,
    profile: any,
    done: any
  ): Promise<any> {
    console.log('VALIDATE AUTH0', profile);
    return done(null, profile); // Pass the entire Auth0 profile
  }
}
