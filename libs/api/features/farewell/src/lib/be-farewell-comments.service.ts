import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  FarewellComment,
  FarewellCommentDocument,
} from './schemas/farewell-comments.schema';

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
        .populate('profileId')
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute farewell comments search for ${farewellId}`,
        err
      );
      throw new Error('Cannot find farewell comments');
    }

    return farewellComments.map((farewellComment) => {
      const farewellCommentObject = farewellComment.toObject();

      return {
        ...farewellCommentObject,
        profileId: farewellCommentObject.profileId?._id,
        profile: farewellCommentObject.profileId?._id
          ? {
              ...farewellCommentObject.profileId,
              id: farewellCommentObject.profileId?._id,
            }
          : null,
      };
    });
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
        profileId: profileId ? new mongoose.Types.ObjectId(profileId) : null,
      });
    } catch (err) {
      console.error(
        `Cannot execute farewell comment create for ${content}, ${medias}, ${farewellId}, ${profileId}`,
        err
      );
      throw new Error('Cannot create farewell comment');
    }

    if (!newFarewellComment) {
      throw new HttpException(
        `Cannot create farewell comment.`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      if (newFarewellComment.profileId) {
        await newFarewellComment.populate('profileId');
      }
    } catch (err) {
      console.error(
        `Cannot populate farewell comment profileId for ${newFarewellComment._id}`,
        err
      );
      throw new HttpException(
        `Cannot populate farewell comment profileId.`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const newFarewellCommentObject = newFarewellComment.toObject();

    return {
      ...newFarewellCommentObject,
      profileId: newFarewellCommentObject.profileId?._id,
      profile: newFarewellCommentObject.profileId?._id
        ? {
            ...newFarewellCommentObject.profileId,
            id: newFarewellCommentObject.profileId?._id,
          }
        : null,
    };
  }

  async createCommentsFarewell(farewellComments: Array<FarewellComment>) {
    let newFarewellComments;

    try {
      newFarewellComments = await this.farewellCommentsModel.insertMany(
        farewellComments.map(({ content, medias, farewellId, profileId }) => ({
          content,
          medias,
          farewellId: new mongoose.Types.ObjectId(farewellId),
          profileId: profileId ? new mongoose.Types.ObjectId(profileId) : null,
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
        await this.farewellCommentsModel.findOneAndDelete({
          _id: new mongoose.Types.ObjectId(farewellCommentId),
          // $or: [
          //   {
          //     profileId: {
          //       $in: currentProfileIds.map(
          //         (currentProfileId) =>
          //           new mongoose.Types.ObjectId(currentProfileId)
          //       ),
          //     },
          //   },
          //   // { profileId: null },
          // ],
        });
    } catch (err) {
      console.error(
        `Cannot execute farewell comment delete for ${farewellCommentId}`,
        err
      );
      throw new Error('Cannot delete farewell comment');
    }

    if (!farewellCommentDeleted) {
      console.warn(
        `Farewell comment ${farewellCommentId} not found or not authorized for update by provided profiles.`
      );
      throw new HttpException(
        `Farewell comment with ID "${farewellCommentId}" not found or you lack permission.`,
        HttpStatus.NOT_FOUND
      );
    }

    return farewellCommentDeleted;
  }
}
