import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth0User, User } from '../types/user';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJWT(user: User): Promise<string> {
    return this.jwtService.sign(user);
  }

  decode(id_token: string): Auth0User {
    return this.jwtService.decode(id_token);
  }
}
