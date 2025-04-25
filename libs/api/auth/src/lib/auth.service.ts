import { Auth0Kit } from '@kitouch/shared-models';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJWT(auth0Kit: Auth0Kit): Promise<string> {
    return this.jwtService.sign(auth0Kit);
  }

  decode(id_token: string): Auth0Kit {
    return this.jwtService.decode(id_token);
  }
}
