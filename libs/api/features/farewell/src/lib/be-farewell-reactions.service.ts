import { FarewellReaction as IFarewellReactions } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
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

  async getReactionsFarewell(farewellId: string) {
    let farewellReactions;

    try {
      farewellReactions = await this.farewellReactionsModel
        .find({
          farewellId: new mongoose.Types.ObjectId(farewellId),
        })
        .populate('profileId')
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

    return farewellReactions.map((farewellReaction) => {
      const farewellReactionObject = farewellReaction.toObject();

      return {
        ...farewellReactionObject,
        profileId: farewellReactionObject.profileId?._id,
        profile: farewellReactionObject.profileId?._id
          ? {
              ...farewellReactionObject.profileId,
              id: farewellReactionObject.profileId?._id,
            }
          : null,
      };
    });
  }

  async createReactionsFarewell({
    farewellId,
    profileId,
    content,
  }: IFarewellReactions) {
    let newFarewellReaction;

    try {
      newFarewellReaction = await this.farewellReactionsModel.create({
        content,
        farewellId: new mongoose.Types.ObjectId(farewellId),
        profileId: profileId ? new mongoose.Types.ObjectId(profileId) : null,
      });
    } catch (err) {
      console.error(
        `Cannot execute farewell reaction create for ${farewellId}, ${profileId}, ${content}`,
        err
      );
      throw new HttpException(
        'Cannot create farewell reaction',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return newFarewellReaction;
  }

  async deleteFarewellReactions(
    farewellReactionId: string,
    currentProfileIds: Array<string>
  ) {
    let deletedFarewellReactions;

    try {
      deletedFarewellReactions = await this.farewellReactionsModel
        .findOneAndDelete({
          _id: new mongoose.Types.ObjectId(farewellReactionId),
          // $or: [
          //   {
          //     profileId: {
          //       $in: currentProfileIds.map(
          //         (currentProfileId) =>
          //           new mongoose.Types.ObjectId(currentProfileId)
          //       ),
          //     },
          //   },
          //   { profileId: null },
          // ],
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

    if (!deletedFarewellReactions) {
      console.warn(
        `Farewell reaction ${farewellReactionId} not found or not authorized for update by provided profiles.`
      );
      throw new HttpException(
        `Farewell reaction with ID "${farewellReactionId}" not found or you lack permission.`,
        HttpStatus.NOT_FOUND
      );
    }

    return deletedFarewellReactions;
  }
}
