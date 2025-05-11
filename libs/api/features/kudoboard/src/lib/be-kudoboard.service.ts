import {
  KudoBoard as IKudoBoard,
  KudoBoardStatus,
} from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { KudoBoard, KudoBoardDocument } from './schemas';

@Injectable()
export class BeKudoboardService {
  constructor(
    @InjectModel(KudoBoard.name)
    private kudoBoardModel: Model<KudoBoardDocument>,
  ) {}

  async getProfileKudoboards(profileId: string) {
    let kudoBoards: Array<KudoBoardDocument>;

    try {
      kudoBoards = await this.kudoBoardModel
        .find<KudoBoardDocument>({
          profileId: new mongoose.Types.ObjectId(profileId),
        })
        .exec();
    } catch (err) {
      console.error(`Cannot execute kudoboard search for %s`, profileId, err);
      throw new HttpException(
        'Cannot find kudoboards',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return kudoBoards;
  }

  async getKudoboard(kudoBoardId: string, currentProfileIds: Array<string>) {
    let kudoBoard;

    try {
      kudoBoard = await this.kudoBoardModel
        .findOne({
          _id: new mongoose.Types.ObjectId(kudoBoardId),
        })
        .populate('profileId')
        .exec();
    } catch (err) {
      console.error(`Cannot execute kudoboard search for %s`, kudoBoardId, err);
      throw new HttpException(
        'Cannot find kudoboard',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const kudoBoardObject = kudoBoard?.toObject();
    const kudoWithStatus =
      kudoBoardObject?.status === KudoBoardStatus.Published ||
      (kudoBoardObject?.profileId?._id?.toString() &&
        currentProfileIds.includes(kudoBoardObject?.profileId?._id?.toString()))
        ? kudoBoardObject
        : {
            id: kudoBoardObject?.id,
            profileId: kudoBoardObject?.profileId,
            status: kudoBoardObject?.status,
          };

    return {
      ...kudoWithStatus,
      profileId: kudoBoardObject?.profileId?._id,
      profile: kudoBoardObject?.profileId?._id
        ? {
            ...kudoBoardObject.profileId,
            id: kudoBoardObject.profileId?._id,
          }
        : null,
    };
  }

  async createKudoboard({
    profileId,
    title,
    content,
    recipient,
    background,
    status,
  }: IKudoBoard) {
    let newKudoBoard;

    try {
      newKudoBoard = await this.kudoBoardModel.create({
        title,
        content,
        recipient,
        background,
        status,
        profileId: profileId ? new mongoose.Types.ObjectId(profileId) : null,
      });
    } catch (err) {
      console.error(`Cannot execute kudoboard create for %s`, profileId, err);
      throw new HttpException(
        'Cannot create kudoboard',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return newKudoBoard;
  }

  async updateKudoboard(
    kudoboardId: string,
    { profileId, title, content, recipient, background, status }: IKudoBoard,
  ) {
    let updatedKudoBoard;

    try {
      updatedKudoBoard = await this.kudoBoardModel
        .findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(kudoboardId) },
          {
            title,
            content,
            recipient,
            background,
            status,
            profileId: profileId
              ? new mongoose.Types.ObjectId(profileId)
              : null,
          },
          { new: true },
        )
        .exec();
    } catch (err) {
      console.error(`Cannot execute kudoboard update for`, err);
      throw new HttpException(
        'Cannot update kudoboard',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return updatedKudoBoard;
  }

  async deleteKudoboard(kudoboardId: string) {
    let deletedKudoBoard;

    try {
      deletedKudoBoard = await this.kudoBoardModel
        .findOneAndDelete({
          _id: new mongoose.Types.ObjectId(kudoboardId),
        })
        .exec();
    } catch (err) {
      console.error(`Cannot execute kudoboard delete for %s`, kudoboardId, err);
      throw new HttpException(
        'Cannot delete kudoboard',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return deletedKudoBoard;
  }
}
