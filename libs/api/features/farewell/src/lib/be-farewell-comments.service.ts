import { Injectable } from '@nestjs/common';
import {
  FarewellComments,
  FarewellCommentsDocument,
} from './schemas/farewell-comments.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BeFarewellCommentsService {
  constructor(
    @InjectModel(FarewellComments.name)
    private farewellCommentsModel: Model<FarewellCommentsDocument>
  ) {}
}
