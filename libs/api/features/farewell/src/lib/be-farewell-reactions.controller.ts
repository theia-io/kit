import { Controller } from '@nestjs/common';
import { BeFarewellReactionsService } from './be-farewell-reactions.service';

@Controller('farewell-reactions')
export class BeFarewellReactionsController {
  constructor(private beFarewellReactionsService: BeFarewellReactionsService) {}
}
