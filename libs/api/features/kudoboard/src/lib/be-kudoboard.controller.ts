import { Controller } from '@nestjs/common';
import { BeKudoboardService } from './be-kudoboard.service';

@Controller('be-kudoboard')
export class BeKudoboardController {
  constructor(private beKudoboardService: BeKudoboardService) {}
}
