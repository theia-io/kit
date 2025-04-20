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
    private kudoBoardCommentsModel: Model<KudoBoardCommentsDocument>
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
        `Cannot execute kudoboard comments search for ${kudoBoardId}`,
        err
      );
      throw new HttpException(
        'Cannot find kudoboards comments',
        HttpStatus.INTERNAL_SERVER_ERROR
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
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute kudoboard comments search for ${kudoBoardId}`,
        err
      );
      throw new HttpException(
        'Cannot find kudoboard comments',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    console.log('getCommentsKudoBoard', kudoBoardId, kudoBoardComments);

    return kudoBoardComments;
  }

  async createCommentsKudoBoard(kudoBoard: IKudoBoardComment) {
    let newKudoBoardComments;

    try {
      newKudoBoardComments = await this.kudoBoardCommentsModel.create({
        ...kudoBoard,
        kudoBoardId: new mongoose.Types.ObjectId(kudoBoard.kudoBoardId),
        profileId: kudoBoard.profileId
          ? new mongoose.Types.ObjectId(kudoBoard.profileId)
          : null,
      });
    } catch (err) {
      console.error(
        `Cannot execute kudoboard comments create for ${kudoBoard.toString()}`,
        err
      );
      throw new HttpException(
        'Cannot create kudoboard comments',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return newKudoBoardComments;
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
        `Cannot execute kudoboard comments delete for ${commentId}`,
        err
      );
      throw new HttpException(
        'Cannot delete kudoboard comments',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return deletedKudoboardComments;
  }
}
