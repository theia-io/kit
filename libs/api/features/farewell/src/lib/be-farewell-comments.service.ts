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

  async getCommentsFarewell(farewellId: string) {
    let farewellComments;

    try {
      farewellComments = await this.farewellCommentsModel
        .find({
          farewellId: farewellId,
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
  async createCommentsFarewell(farewell: FarewellComments) {
    let newFarewellComment;

    try {
      newFarewellComment = await this.farewellCommentsModel.create({
        ...farewell,
        farewellId: farewell.farewellId,
        profileId: farewell.profileId,
      });
    } catch (err) {
      console.error(
        `Cannot execute farewell comment create for ${farewell.toString()}`,
        err
      );
      throw new Error('Cannot create farewell comment');
    }

    console.log('RES', newFarewellComment);
    return newFarewellComment;
  }
  async deleteFarewellComments(farewellCommentId: string) {
    let farewellCommentDeleted;

    try {
      farewellCommentDeleted =
        await this.farewellCommentsModel.findByIdAndDelete(farewellCommentId);
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
