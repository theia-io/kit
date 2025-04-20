import { Farewell as Ifarewell } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Farewell, FarewellDocument } from './schemas';

@Injectable()
export class BeFarewellService {
  createfarewell(Farewell: Ifarewell) {
    throw new Error('Method not implemented.');
  }
  farewellsModel: any;
  farewellModel: any;

  async getfarewell(farewellId: string) {
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
  async createFarewell(farewell: Ifarewell) {
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
  async updatefarewell(farewellId: string, farewell: Ifarewell) {
    let updatedfarewell;

    try {
      updatedfarewell = await this.farewellModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(farewellId) },
        { ...farewell },
        { new: true }
      );
    } catch (err) {
      console.error(`Cannot execute farewell update for ${farewellId}`, err);
      throw new HttpException(
        'Cannot update farewell',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return updatedfarewell;
  }
  async deletefarewell(farewellId: string) {
    let deletedfarewell;

    try {
      deletedfarewell = await this.farewellModel.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(farewellId),
      });
    } catch (err) {
      console.error(`Cannot execute farewell delete for ${farewellId}`, err);
      throw new HttpException(
        'Cannot delete farewell',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return deletedfarewell;
  }
  async getFarewells(profileId: string) {
    let farewells;

    try {
      farewells = await this.farewellModel
        .findOne({
          _id: new mongoose.Types.ObjectId(profileId),
        })
        .exec();
    } catch (err) {
      console.error(`Cannot execute farewells search for ${farewells}`, err);
      throw new HttpException(
        'Cannot find farewells',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return farewells;
  }
  async getProfilefarewell(profileId: string) {
    let farewells;

    try {
      farewells = await this.farewellModel
        .findOne({
          _id: new mongoose.Types.ObjectId(profileId),
        })
        .exec();
    } catch (err) {
      console.error(`Cannot execute farewells search for ${farewells}`, err);
      throw new HttpException(
        'Cannot find farewells',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return farewells;
  }
}
