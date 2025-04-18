import { Controller } from '@nestjs/common';
import { BeKudoBoardReactionsService } from './be-kudoboard-reactions.service';

@Controller('kudoboard-reactions')
export class BeKudoBoardReactionsController {
  constructor(
    private beKudoBoardReactionsService: BeKudoBoardReactionsService
  ) {}
}
