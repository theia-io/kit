import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';

import { AppService } from './app.service';
import {
  CreateCatDto,
  ZodValidationPipe,
  createCatSchema,
} from './pipes/validation';
import { Roles } from './auth/roles/roles.drecorator';

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
  async create(@Body() catDto: CreateCatDto) {
    console.log('catDto', catDto);
    return this.appService.getData();
  }
}
