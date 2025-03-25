import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { AppService } from './app.service';
import { Roles } from './auth/roles/roles.drecorator';
import { ZodValidationPipe, createCatSchema } from './pipes/validation';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  getUser(@Req() req: Request) {
    return {
      ...this.appService.getData(),
      ...req.user,
    };
  }

  @Post()
  @Roles(['admin'])
  @UsePipes(new ZodValidationPipe(createCatSchema))
  async create() {
    return this.appService.getData();
  }
}
