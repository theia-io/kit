import { KudoBoardComment as IKudoBoardComment } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  KudoBoardComments,
  KudoBoardCommentsDocument,
} from './schemas/kudoboard-comments.schema';

@Injectable()
export class BeKudoBoardCommentsService {
  constructor(
    @InjectModel(KudoBoardComments.name)
    private kudoBoardCommentsModel: Model<KudoBoardCommentsDocument>,
  ) {}

  async getCommentsKudoBoards(kudoBoardId: Array<string>) {
    let kudoBoardsComments: Array<KudoBoardCommentsDocument>;

    try {
      kudoBoardsComments = await this.kudoBoardCommentsModel
        .find<KudoBoardCommentsDocument>({
          kudoBoardId: {
            $in: kudoBoardId.map((id) => new mongoose.Types.ObjectId(id)),
          },
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute kudoboard comments search for %s`,
        kudoBoardId,
        err,
      );
      throw new HttpException(
        'Cannot find kudoboards comments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return kudoBoardsComments;
  }

  async getCommentsKudoBoard(kudoBoardId: string) {
    let kudoBoardComments;

    try {
      kudoBoardComments = await this.kudoBoardCommentsModel
        .find({
          kudoBoardId: new mongoose.Types.ObjectId(kudoBoardId),
        })
        .populate('profileId')
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute kudoboard comments search for %s`,
        kudoBoardId,
        err,
      );
      throw new HttpException(
        'Cannot find kudoboard comments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return kudoBoardComments.map((comment) => {
      const { profileId, ...rest } = comment.toObject();

      return {
        ...rest,
        profile: {
          ...profileId,
          id: profileId?._id,
        },
        profileId: profileId?._id,
      };
    });
  }

  async createCommentKudoBoard({
    kudoBoardId,
    profileId,
    content,
    medias,
  }: IKudoBoardComment) {
    let newKudoBoardComments;

    try {
      newKudoBoardComments = await this.kudoBoardCommentsModel.create({
        content,
        medias,
        kudoBoardId: new mongoose.Types.ObjectId(kudoBoardId),
        profileId: profileId ? new mongoose.Types.ObjectId(profileId) : null,
      });
    } catch (err) {
      console.error(
        `Cannot execute kudoboard comments create for %s, %s, %s, %s`,
        content,
        medias,
        kudoBoardId,
        profileId,
        err,
      );
      throw new HttpException(
        'Cannot create kudoboard comments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!newKudoBoardComments) {
      throw new HttpException(
        `Cannot create kudoboard comment.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      if (newKudoBoardComments.profileId) {
        await newKudoBoardComments.populate('profileId');
      }
    } catch (err) {
      console.error(
        `Cannot populate kudoboard comment profileId for %s`,
        newKudoBoardComments._id,
        err,
      );
      throw new HttpException(
        `Cannot populate kudoboard comment profileId.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const newKudoBoardCommentsObject = newKudoBoardComments.toObject();

    return {
      ...newKudoBoardCommentsObject,
      profileId: newKudoBoardCommentsObject.profileId?._id,
      profile: newKudoBoardCommentsObject.profileId?._id
        ? {
            ...newKudoBoardCommentsObject.profileId,
            id: newKudoBoardCommentsObject.profileId?._id,
          }
        : null,
    };
  }

  async deleteKudoboardComments(commentId: string) {
    let deletedKudoboardComments;

    try {
      deletedKudoboardComments = await this.kudoBoardCommentsModel
        .findOneAndDelete({
          _id: new mongoose.Types.ObjectId(commentId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute kudoboard comments delete for %s`,
        commentId,
        err,
      );
      throw new HttpException(
        'Cannot delete kudoboard comments',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return deletedKudoboardComments;
  }
}
