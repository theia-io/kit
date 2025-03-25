import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secretOrKey = `${process.env['JWT_SECRET']}`;
    if (!secretOrKey) {
      throw new Error('JWT secret misconfigured');
    }

    super({
      // secretOrKeyProvider: passportJwtSecret({
      //   cache: true,
      //   rateLimit: true,
      //   jwksRequestsPerMinute: 5,
      //   jwksUri: `${process.env['AUTH0_DOMAIN']}.well-known/jwks.json`,
      // }),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          let token = null;
          if (req && req.cookies) {
            token = req.cookies['jwt'];
          }
          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  // Simplified validate method - just return the payload
  async validate(payload: any) {
    // We are not querying DB, and simply return user data from the token
    return payload;
  }
}
