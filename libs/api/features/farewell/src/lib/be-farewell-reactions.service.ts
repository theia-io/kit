import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  FarewellReactions,
  FarewellReactionsDocument,
} from './schemas/farewell-reaction.schema';
import { FarewellReaction as IFarewellReactions } from '@kitouch/shared-models';

@Injectable()
export class BeFarewellReactionsService {
  constructor(
    @InjectModel(FarewellReactions.name)
    private farewellReactionsModel: Model<FarewellReactionsDocument>
  ) {}

  async getReactionsFarewell(farewellId: string) {
    let farewellReactions;

    try {
      farewellReactions = await this.farewellReactionsModel
        .find({
          farewellId: new mongoose.Types.ObjectId(farewellId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute farewell reactions search for ${farewellId}`,
        err
      );
      throw new HttpException(
        'Cannot find kudoboard reactions',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return farewellReactions;
  }

  async createReactionsFarewell(farewell: IFarewellReactions) {
    let newFarewellReaction;

    try {
      newFarewellReaction = await this.farewellReactionsModel.create({
        ...farewell,
        farewellId: new mongoose.Types.ObjectId(farewell.farewellId),
        profileId: new mongoose.Types.ObjectId(farewell.profileId),
      });
    } catch (err) {
      console.error(
        `Cannot execute farewell reaction create for ${farewell.toString()}`,
        err
      );
      throw new HttpException(
        'Cannot create farewell reaction',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    console.log('RES', newFarewellReaction);

    return newFarewellReaction;
  }

  async deleteFarewellReactions(farewellReactionId: string) {
    let deletedFarewellReactions;

    try {
      deletedFarewellReactions = await this.farewellReactionsModel
        .findOneAndDelete({
          _id: new mongoose.Types.ObjectId(farewellReactionId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute farewell reaction delete for ${farewellReactionId}`,
        err
      );
      throw new HttpException(
        'Cannot delete farewell reactions',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return deletedFarewellReactions;
  }
}
