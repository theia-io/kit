import { Controller } from '@nestjs/common';
import { BeKudoBoardCommentsService } from './be-kudoboard-comments.service';

@Controller('kudoboard-comments')
export class BeKudoBoardCommentsController {
  constructor(private beKudoBoardCommentsService: BeKudoBoardCommentsService) {}
}
