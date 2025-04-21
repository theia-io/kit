import { FarewellAnalytics as IFarewellsAnalytics } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import {
  FarewellAnalytics,
  FarewellAnalyticsDocument,
} from './schemas/farewell-analytics.schema';

@Injectable()
export class BeFarewellAnalyticsService {
  constructor(
    @InjectModel(FarewellAnalytics.name)
    private farewellAnalyticsModel: Model<FarewellAnalyticsDocument>
  ) {}

  async getAnalyticsFarewells(farewellId: Array<string>) {
    let farewellsAnalytics: Array<FarewellAnalyticsDocument>;

    try {
      farewellsAnalytics = await this.farewellAnalyticsModel
        .find<FarewellAnalyticsDocument>({
          farewellId: {
            $in: farewellId.map((id) => new mongoose.Types.ObjectId(id)),
          },
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute farewell analytics search for ${farewellId}`,
        err
      );
      throw new HttpException(
        'Cannot find farewells analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return farewellsAnalytics;
  }

  async getAnalyticsFarewell(farewellId: string) {
    let farewellAnalytics;

    try {
      farewellAnalytics = await this.farewellAnalyticsModel
        .find({
          farewellId: new mongoose.Types.ObjectId(farewellId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute farewell analytics search for ${farewellId}`,
        err
      );
      throw new HttpException(
        'Cannot find farewell analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return farewellAnalytics;
  }

  async createAnalyticsfarewell(farewell: IFarewellsAnalytics) {
    let newfarewellAnalytics;

    try {
      newfarewellAnalytics = await this.farewellAnalyticsModel.create({
        ...farewell,
        farewellId: new mongoose.Types.ObjectId(farewell.farewellId),
      });
    } catch (err) {
      console.error(
        `Cannot execute farewell analytics create for ${farewell.toString()}`,
        err
      );
      throw new HttpException(
        'Cannot create farewell analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return newfarewellAnalytics;
  }

  async deleteFarewellAnalytics(farewellId: string) {
    let deletedFarewellAnalytics;

    try {
      deletedFarewellAnalytics = await this.farewellAnalyticsModel
        .findOneAndDelete({
          farewellId: new mongoose.Types.ObjectId(farewellId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute farewell analytics delete for ${farewellId}`,
        err
      );
      throw new HttpException(
        'Cannot delete farewell analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return deletedFarewellAnalytics;
  }
}
