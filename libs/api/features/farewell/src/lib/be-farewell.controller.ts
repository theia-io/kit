import { Controller } from '@nestjs/common';
import { BeFarewellService } from './be-farewell.service';

@Controller('farewell')
export class BeFarewellController {
  constructor(private beFarewellService: BeFarewellService) {}
}
