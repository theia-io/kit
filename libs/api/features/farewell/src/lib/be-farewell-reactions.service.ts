import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  FarewellReactions,
  FarewellReactionsDocument,
} from './schemas/farewell-reaction.schema';

@Injectable()
export class BeFarewellReactionsService {
  constructor(
    @InjectModel(FarewellReactions.name)
    private farewellReactionsModel: Model<FarewellReactionsDocument>
  ) {}
}
