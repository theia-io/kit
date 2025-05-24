import { ExpOffboardingAnalytics as IExpOffboardingAnalytics } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  ExpOffboardingAnalytics,
  ExpOffboardingAnalyticsDocument,
} from './schemas/offboarding-analytics.schema';

@Injectable()
export class BeOffboardingAnalyticsService {
  constructor(
    @InjectModel(ExpOffboardingAnalytics.name)
    private offboardingAnalyticsModel: Model<ExpOffboardingAnalyticsDocument>
  ) {}

  async getAnalyticsOffboardings(offboardingId: Array<string>) {
    let OffboardingsAnalytics: Array<ExpOffboardingAnalyticsDocument>;

    try {
      OffboardingsAnalytics = await this.offboardingAnalyticsModel
        .find<ExpOffboardingAnalyticsDocument>({
          offboardingId: {
            $in: offboardingId.map((id) => new mongoose.Types.ObjectId(id)),
          },
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute offboarding analytics search for %s`,
        offboardingId,
        err
      );
      throw new HttpException(
        'Cannot find Offboardings analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return OffboardingsAnalytics;
  }

  async getAnalyticsOffboarding(offboardingId: string) {
    let kudoBoardAnalytics;

    try {
      kudoBoardAnalytics = await this.offboardingAnalyticsModel
        .find({
          offboardingId: new mongoose.Types.ObjectId(offboardingId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute offboarding analytics search for %s`,
        offboardingId,
        err
      );
      throw new HttpException(
        'Cannot find offboarding analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return kudoBoardAnalytics;
  }

  async createAnalyticsOffboarding({
    offboardingId,
    profileId,
    ...restOffboardingAnalytics
  }: IExpOffboardingAnalytics) {
    let createdOffboardingAnalytics;

    try {
      createdOffboardingAnalytics = await this.offboardingAnalyticsModel.create(
        {
          ...restOffboardingAnalytics,
          offboardingId: new mongoose.Types.ObjectId(offboardingId),
          profileId: profileId ? new mongoose.Types.ObjectId(profileId) : null,
        }
      );
    } catch (err) {
      console.error(`Cannot execute Offboarding update for`, err);
      throw new HttpException(
        'Cannot update Offboarding',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return createdOffboardingAnalytics;
  }

  async deleteOffboardingAnalytics(
    offboardingId: string,
    currentProfileIds: Array<string>
  ) {
    let deletedOffboardingAnalytics;

    try {
      deletedOffboardingAnalytics = await this.offboardingAnalyticsModel
        .findOneAndDelete({
          offboardingId: new mongoose.Types.ObjectId(offboardingId),
          profileId: {
            $in: currentProfileIds.map((id) => new mongoose.Types.ObjectId(id)),
          },
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute offboarding analytics delete for %s`,
        offboardingId,
        err
      );
      throw new HttpException(
        'Cannot delete offboarding analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return deletedOffboardingAnalytics;
  }
}
