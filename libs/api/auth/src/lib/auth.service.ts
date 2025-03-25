import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../types/user';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJwtToken(id_token: string) {
    try {
      const idToken = id_token;
      const {
        email,
        given_name: name,
        family_name: surname,
        picture,
      } = this.jwtService.decode(idToken); // Decode JWT to get user data

      const token = await this.generateJWT({ email, name, surname, picture }); // use it
      return token;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to exchange id token for JWT token');
    }
  }

  async generateJWT(user: User): Promise<string> {
    return this.jwtService.sign(user);
  }
}
