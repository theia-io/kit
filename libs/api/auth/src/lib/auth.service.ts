import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJWT(profile: any): Promise<string> {
    // Use the Auth0 user ID (sub) as the subject of our JWT
    const payload = { sub: profile.id, ...profile }; // Include relevant profile data
    return this.jwtService.sign(payload);
  }
}
