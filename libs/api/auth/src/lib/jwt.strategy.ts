import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../types/user';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    const secretOrKey = `${process.env['JWT_SECRET']}`;
    if (!secretOrKey) {
      throw new Error('JWT secret misconfigured');
    }

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.jwt || null,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey,
    });
  }

  // Simplified validate method - just return the payload
  async validate(payload: User) {
    console.log('JwtStrategy validate', payload);
    // We are not querying DB, and simply return user data from the token
    return payload;
  }
}
