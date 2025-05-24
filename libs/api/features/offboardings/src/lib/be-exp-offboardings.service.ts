import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ExpOffboarding, ExpOffboardingDocument } from './schemas';
import {
  ExpOffboardingStatus,
  ExpOffboarding as IExpOffboarding,
} from '@kitouch/shared-models';

@Injectable()
export class BeExpOffboardingsService {
  constructor(
    @InjectModel(ExpOffboarding.name)
    private offboardingModel: Model<ExpOffboardingDocument>
  ) {}

  async getProfileOffboardings(profileId: string) {
    let offboardings: Array<ExpOffboardingDocument>;

    try {
      offboardings = await this.offboardingModel
        .find<ExpOffboardingDocument>({
          profileId: new mongoose.Types.ObjectId(profileId),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute offboardings search for %s`,
        profileId,
        err
      );
      throw new HttpException(
        'Cannot find your profile offboardings',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return offboardings;
  }

  async getOffboarding(
    offboardingId: string,
    currentProfileIds: Array<string>
  ) {
    let offboarding;

    try {
      offboarding = await this.offboardingModel
        .findOne({
          _id: new mongoose.Types.ObjectId(offboardingId),
        })
        .populate('profileId')
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute offboarding search for %s`,
        offboardingId,
        err
      );
      throw new HttpException(
        'Cannot find offboarding',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return this.#filterOffboardingContentForStatus(
      currentProfileIds,
      offboarding?.toObject() as any as IExpOffboarding
    );
  }

  // TODO IMPLEMENT ME
  #filterOffboardingContentForStatus(
    currentProfileIds: Array<string>,
    offboarding?: IExpOffboarding
  ) {
    console.log(
      `Filtering offboarding content for status, currentProfileIds: ${currentProfileIds}, offboarding: ${JSON.stringify(
        offboarding
      )}`
    );

    let offboardingContentWithStatus;
    switch (offboarding?.status) {
      case ExpOffboardingStatus.Draft:
        offboardingContentWithStatus = {
          ...offboarding,
          content: '',
          kudoboardIds: [],
          farewellIds: [],
        };
        break;
      default:
        offboardingContentWithStatus = offboarding;
    }

    return offboardingContentWithStatus;
  }
}
