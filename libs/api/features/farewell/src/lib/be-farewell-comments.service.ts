import { Injectable } from '@nestjs/common';
import {
  FarewellComment,
  FarewellCommentDocument,
} from './schemas/farewell-comments.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class BeFarewellCommentsService {
  constructor(
    @InjectModel(FarewellComment.name)
    private farewellCommentsModel: Model<FarewellCommentDocument>
  ) {}

  async getCommentsFarewell(farewellId: string) {
    let farewellComments;

    try {
      farewellComments = await this.farewellCommentsModel
        .find({
          farewellId: new mongoose.Types.ObjectId(farewellId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute farewell comments search for ${farewellId}`,
        err
      );
      throw new Error('Cannot find farewell comments');
    }

    return farewellComments;
  }

  async createCommentFarewell({
    content,
    medias,
    farewellId,
    profileId,
  }: FarewellComment) {
    let newFarewellComment;

    try {
      newFarewellComment = await this.farewellCommentsModel.create({
        content,
        medias,
        farewellId: new mongoose.Types.ObjectId(farewellId),
        profileId: new mongoose.Types.ObjectId(profileId),
      });
    } catch (err) {
      console.error(
        `Cannot execute farewell comment create for ${content}, ${medias}, ${farewellId}, ${profileId}`,
        err
      );
      throw new Error('Cannot create farewell comment');
    }

    console.log('RES', newFarewellComment);
    return newFarewellComment;
  }

  async createCommentsFarewell(farewellComments: Array<FarewellComment>) {
    let newFarewellComments;

    try {
      newFarewellComments = await this.farewellCommentsModel.insertMany(
        farewellComments.map(({ content, medias, farewellId, profileId }) => ({
          content,
          medias,
          farewellId: new mongoose.Types.ObjectId(farewellId),
          profileId: new mongoose.Types.ObjectId(profileId),
        }))
      );
    } catch (err) {
      console.error(
        `Cannot execute farewell comment create for ${farewellComments.toString()}`,
        err
      );
      throw new Error('Cannot create farewell comments');
    }

    return newFarewellComments;
  }

  async deleteFarewellComments(
    farewellCommentId: string,
    currentProfileIds: Array<string>
  ) {
    let farewellCommentDeleted;

    try {
      farewellCommentDeleted =
        await this.farewellCommentsModel.findByIdAndDelete({
          _id: new mongoose.Types.ObjectId(farewellCommentId),
          $or: [
            { profileId: null },
            {
              profileId: {
                $in: currentProfileIds.map(
                  (currentProfileId) =>
                    new mongoose.Types.ObjectId(currentProfileId)
                ),
              },
            },
          ],
        });
    } catch (err) {
      console.error(
        `Cannot execute farewell comment delete for ${farewellCommentId}`,
        err
      );
      throw new Error('Cannot delete farewell comment');
    }

    return farewellCommentDeleted;
  }
}
