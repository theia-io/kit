import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  KudoBoardComments,
  KudoBoardCommentsDocument,
} from './schemas/kudoboard-comments.schema';

@Injectable()
export class BeKudoBoardCommentsService {
  constructor(
    @InjectModel(KudoBoardComments.name)
    private kudoBoardCommentsModel: Model<KudoBoardCommentsDocument>
  ) {}
}
