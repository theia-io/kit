import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  getUser(@Req() req: Request) {
    return req.user;
  }
}
