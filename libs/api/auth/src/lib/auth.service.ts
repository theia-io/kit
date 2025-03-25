import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJWT(auth0User: any): Promise<string> {
    // Use the Auth0 user's 'sub' claim as the subject of *your* JWT
    const payload = { sub: auth0User.sub, ...auth0User }; // Include other relevant user data
    return this.jwtService.sign(payload);
  }
}
