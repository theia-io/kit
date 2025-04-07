import { ConfigService } from '@kitouch/be-config';
import { Auth0User } from '@kitouch/shared-models';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    const secretOrKey = configService.getConfig('auth').jwtSecret;
    if (!secretOrKey) {
      throw new Error('JWT secret misconfigured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.jwt || null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  // Simplified validate method - just return the payload
  async validate(payload: Auth0User) {
    // We are not querying DB, and simply return user data from the token
    return payload;
  }
}
