import { KudoBoardReaction as IKudoBoardReactions } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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

  async getReactionsKudoBoard(kudoBoardId: string) {
    let kudoBoardReactions;

    try {
      kudoBoardReactions = await this.kudoBoardReactionsModel
        .find({
          kudoBoardId: new mongoose.Types.ObjectId(kudoBoardId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute kudoboard reactions search for %s`,
        kudoBoardId,
        err
      );
      throw new HttpException(
        'Cannot find kudoboard reactions',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return kudoBoardReactions;
  }

  async createReactionsKudoBoard({
    kudoBoardId,
    profileId,
    content,
  }: IKudoBoardReactions) {
    let newKudoBoardReaction;

    try {
      newKudoBoardReaction = await this.kudoBoardReactionsModel.create({
        content,
        kudoBoardId: new mongoose.Types.ObjectId(kudoBoardId),
        profileId: profileId ? new mongoose.Types.ObjectId(profileId) : null,
      });
    } catch (err) {
      console.error(
        `Cannot execute kudoboard reaction create for kudoBoardId: %s, profileId: %s`,
        kudoBoardId,
        profileId,
        err
      );
      throw new HttpException(
        'Cannot create kudoboard reaction',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    console.log('RES', newKudoBoardReaction);

    return newKudoBoardReaction;
  }

  async deleteKudoboardReactions(kudoBoardReactionId: string) {
    let deletedKudoboardReactions;

    try {
      deletedKudoboardReactions = await this.kudoBoardReactionsModel
        .findOneAndDelete({
          _id: new mongoose.Types.ObjectId(kudoBoardReactionId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute kudoboard reaction delete for %s`,
        kudoBoardReactionId,
        err
      );
      throw new HttpException(
        'Cannot delete kudoboard reactions',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return deletedKudoboardReactions;
  }
}
