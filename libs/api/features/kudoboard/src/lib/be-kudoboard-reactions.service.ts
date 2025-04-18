import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  KudoBoardReactions,
  KudoBoardReactionsDocument,
} from './schemas/kudoboard-reaction.schema';

@Injectable()
export class BeKudoBoardReactionsService {
  constructor(
    @InjectModel(KudoBoardReactions.name)
    private kudoBoardReactionsModel: Model<KudoBoardReactionsDocument>
  ) {}
}
