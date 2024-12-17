import { Controller, Get, Post, UsePipes } from '@nestjs/common';

import { AppService } from './app.service';
import { Roles } from './auth/roles/roles.drecorator';
import { ZodValidationPipe, createCatSchema } from './pipes/validation';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post()
  @Roles(['admin'])
  @UsePipes(new ZodValidationPipe(createCatSchema))
  async create() {
    return this.appService.getData();
  }
}
