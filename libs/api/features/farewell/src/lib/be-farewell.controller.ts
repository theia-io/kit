import { Controller } from '@nestjs/common';
import { BeFarewellService } from './be-farewell.service';

@Controller('be-farewell')
export class BeFarewellController {
  constructor(private beFarewellService: BeFarewellService) {}
}
