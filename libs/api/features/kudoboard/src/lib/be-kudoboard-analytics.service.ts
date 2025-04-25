import { KudoBoardAnalytics as IKudoBoardAnalytics } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  KudoBoardAnalytics,
  KudoBoardAnalyticsDocument,
} from './schemas/kudoboard-analytics.schema';

@Injectable()
export class BeKudoBoardAnalyticsService {
  constructor(
    @InjectModel(KudoBoardAnalytics.name)
    private kudoBoardAnalyticsModel: Model<KudoBoardAnalyticsDocument>
  ) {}

  async getAnalyticsKudoBoards(kudoBoardId: Array<string>) {
    let kudoBoardsAnalytics: Array<KudoBoardAnalyticsDocument>;

    try {
      kudoBoardsAnalytics = await this.kudoBoardAnalyticsModel
        .find<KudoBoardAnalyticsDocument>({
          kudoBoardId: {
            $in: kudoBoardId.map((id) => new mongoose.Types.ObjectId(id)),
          },
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute kudoboard analytics search for %s`,
        kudoBoardId,
        err
      );
      throw new HttpException(
        'Cannot find kudoboards analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return kudoBoardsAnalytics;
  }

  async getAnalyticsKudoBoard(kudoBoardId: string) {
    let kudoBoardAnalytics;

    try {
      kudoBoardAnalytics = await this.kudoBoardAnalyticsModel
        .find({
          kudoBoardId: new mongoose.Types.ObjectId(kudoBoardId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute kudoboard analytics search for %s`,
        kudoBoardId,
        err
      );
      throw new HttpException(
        'Cannot find kudoboard analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return kudoBoardAnalytics;
  }

  async createAnalyticsKudoBoard({ kudoBoardId, event }: IKudoBoardAnalytics) {
    let newKudoBoardAnalytics;

    try {
      newKudoBoardAnalytics = await this.kudoBoardAnalyticsModel.create({
        event,
        kudoBoardId: new mongoose.Types.ObjectId(kudoBoardId),
      });
    } catch (err) {
      console.error(
        `Cannot execute kudoboard analytics create for %s`,
        kudoBoardId,
        err
      );
      throw new HttpException(
        'Cannot create kudoboard analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return newKudoBoardAnalytics;
  }

  async deleteKudoboardAnalytics(kudoboardId: string) {
    let deletedKudoboardAnalytics;

    try {
      deletedKudoboardAnalytics = await this.kudoBoardAnalyticsModel
        .findOneAndDelete({
          kudoboardId: new mongoose.Types.ObjectId(kudoboardId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute kudoboard analytics delete for %s`,
        kudoBoardId,
        err
      );
      throw new HttpException(
        'Cannot delete kudoboard analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return deletedKudoboardAnalytics;
  }
}
