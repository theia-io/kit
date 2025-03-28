import { Auth0User } from '@kitouch/shared-models';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJWT(user: Auth0User): Promise<string> {
    return this.jwtService.sign(user);
  }

  decode(id_token: string): Auth0User {
    return this.jwtService.decode(id_token);
  }
}
