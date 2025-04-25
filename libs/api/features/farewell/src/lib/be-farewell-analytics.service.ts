import {
  FarewellAnalytics as IFarewellsAnalytics,
  Farewell as IFarewell,
} from '@kitouch/shared-models';
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

  async getAnalyticFarewells(farewellId: Array<string>) {
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
        `Cannot execute farewell analytics search for %s`,
        farewellId,
        err
      );
      throw new HttpException(
        'Cannot find farewells analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return farewellsAnalytics;
  }

  async getAnalyticFarewell(farewellId: string) {
    let farewellAnalytics;

    try {
      farewellAnalytics = await this.farewellAnalyticsModel
        // TODO Refactor this to `find` once farewell is migrated to better analytics solution - https://trello.com/c/Rzxn7aKg
        .findOne({
          farewellId: new mongoose.Types.ObjectId(farewellId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute farewell analytics search for %s`,
        farewellId,
        err
      );
      throw new HttpException(
        'Cannot find farewell analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return farewellAnalytics;
  }

  async createAnalyticsFarewell({ id }: IFarewell) {
    let newFarewellAnalytics;

    try {
      newFarewellAnalytics = await this.farewellAnalyticsModel.create({
        farewellId: new mongoose.Types.ObjectId(id),
        viewed: 0,
      });
    } catch (err) {
      console.error(
        `Cannot execute farewell analytics create for id: %s`,
        id,
        err
      );
      throw new HttpException(
        'Cannot create farewell analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return newFarewellAnalytics;
  }

  async updateAnalyticsFarewell(
    analyticId: IFarewellsAnalytics['id'],
    { id }: IFarewell
  ) {
    let updatedFarewellAnalytics;

    try {
      updatedFarewellAnalytics =
        await this.farewellAnalyticsModel.findByIdAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(analyticId),
          },
          {
            $inc: { viewed: 1 },
          },
          {
            new: true,
            upsert: true,
          }
        );
    } catch (err) {
      console.error(
        `Cannot execute farewell analytics update for %s and %s`,
        analyticId,
        id,
        err
      );
      throw new HttpException(
        'Cannot update farewell analytics',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return updatedFarewellAnalytics;
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
        `Cannot execute farewell analytics delete for %s`,
        farewellId,
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
