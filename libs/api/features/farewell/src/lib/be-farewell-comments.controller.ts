import { Controller } from '@nestjs/common';
import { BeFarewellCommentsService } from './be-farewell-comments.service';

@Controller('farewell-comments')
export class BeFarewellCommentsController {
  constructor(private beFarewellCommentsService: BeFarewellCommentsService) {}
}
