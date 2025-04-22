import { Farewell as IFarewell } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Farewell, FarewellDocument } from './schemas';

@Injectable()
export class BeFarewellService {
  constructor(
    @InjectModel(Farewell.name)
    private farewellModel: Model<FarewellDocument>
  ) {}

  async getProfileFarewells(profileId: string) {
    let farewells: Array<FarewellDocument>;

    try {
      farewells = await this.farewellModel
        .find<FarewellDocument>({
          profileId: new mongoose.Types.ObjectId(profileId),
        })
        .exec();
    } catch (err) {
      console.error(`Cannot execute farewell search for ${profileId}`, err);
      throw new HttpException(
        'Cannot find farewells',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return farewells;
  }

  async getFarewell(farewellId: string) {
    let farewell;

    try {
      farewell = await this.farewellModel
        .findOne({
          _id: new mongoose.Types.ObjectId(farewellId),
        })
        .exec();
    } catch (err) {
      console.error(`Cannot execute farewell search for ${farewellId}`, err);
      throw new HttpException(
        'Cannot find farewell',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return farewell;
  }

  async createFarewell(farewell: IFarewell) {
    let newfarewell;

    try {
      newfarewell = await this.farewellModel.create({
        ...farewell,
        profileId: farewell.profileId
          ? new mongoose.Types.ObjectId(farewell.profileId)
          : null,
      });
    } catch (err) {
      console.error(
        `Cannot execute farewell create for ${farewell.toString()}`,
        err
      );
      throw new HttpException(
        'Cannot create farewell',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return newfarewell;
  }

  async updateFarewell(farewellId: string, farewell: IFarewell) {
    let updatedFarewell;

    try {
      updatedFarewell = await this.farewellModel
        .findOneAndUpdate(
          { _id: new mongoose.Types.ObjectId(farewellId) },
          {
            ...farewell,
            profileId: farewell.profileId
              ? new mongoose.Types.ObjectId(farewell.profileId)
              : null,
          },
          { new: true }
        )
        .exec();
    } catch (err) {
      console.error(`Cannot execute farewell update for ${farewellId}`, err);
      throw new HttpException(
        'Cannot update farewell',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return updatedFarewell;
  }

  async deleteFarewell(farewellId: string) {
    let deletedFarewell;

    try {
      deletedFarewell = await this.farewellModel.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(farewellId),
      });
    } catch (err) {
      console.error(`Cannot execute farewell delete for ${farewellId}`, err);
      throw new HttpException(
        'Cannot delete farewell',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return deletedFarewell;
  }
}
