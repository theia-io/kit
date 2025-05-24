import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ExpOffboarding, ExpOffboardingDocument } from './schemas';
import {
  ExpOffboardingStatus,
  ExpOffboarding as IExpOffboarding,
  ExpOffboardingAnalytics as IExpOffboardingAnalytics,
} from '@kitouch/shared-models';
import {
  ExpOffboardingAnalytics,
  ExpOffboardingAnalyticsDocument,
} from './schemas/offboarding-analytics.schema';

@Injectable()
export class BeExpOffboardingsService {
  constructor(
    @InjectModel(ExpOffboarding.name)
    private offboardingModel: Model<ExpOffboardingDocument>,
    @InjectModel(ExpOffboardingAnalytics.name)
    private offboardingAnalyticsModel: Model<ExpOffboardingAnalyticsDocument>
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

  async createOffboarding({
    profileId,
    kudoboardIds,
    farewellIds,
    profileIdsNetwork,
    status: _,
    ...restOffboarding
  }: IExpOffboarding) {
    let newOffboarding;

    try {
      newOffboarding = await this.offboardingModel.create({
        ...restOffboarding,
        status: ExpOffboardingStatus.Draft,
        profileId: new mongoose.Types.ObjectId(profileId),
        kudoboardIds: kudoboardIds?.map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
        farewellIds: farewellIds?.map((id) => new mongoose.Types.ObjectId(id)),
        profileIdsNetwork: profileIdsNetwork?.map(
          (id) => new mongoose.Types.ObjectId(id)
        ),
      });
    } catch (err) {
      console.error(`Cannot execute offboarding create for %s`, profileId, err);
      throw new HttpException(
        'Cannot create Offboarding',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return newOffboarding;
  }

  async updateOffboarding(
    offboardingId: string,
    {
      profileId,
      kudoboardIds,
      farewellIds,
      profileIdsNetwork,
      ...restOffboarding
    }: IExpOffboarding,
    currentProfileIds: Array<string>
  ) {
    let updatedOffboarding;

    try {
      updatedOffboarding = await this.offboardingModel
        .findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(offboardingId),
            profileId: {
              $in: currentProfileIds.map(
                (currentProfileId) =>
                  new mongoose.Types.ObjectId(currentProfileId)
              ),
            },
          },
          {
            ...restOffboarding,
            profileId: new mongoose.Types.ObjectId(profileId),
            kudoboardIds: kudoboardIds?.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
            farewellIds: farewellIds?.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
            profileIdsNetwork: profileIdsNetwork?.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
          { new: true }
        )
        .exec();
    } catch (err) {
      console.error(`Cannot execute Offboarding update for`, err);
      throw new HttpException(
        'Cannot update Offboarding',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return updatedOffboarding;
  }

  async deleteOffboarding(
    offboardingId: string,
    currentProfileIds: Array<string>
  ) {
    let deletedOffboarding;

    try {
      deletedOffboarding = await this.offboardingModel
        .findOneAndDelete({
          _id: new mongoose.Types.ObjectId(offboardingId),
          profileId: {
            $in: currentProfileIds.map(
              (currentProfileId) =>
                new mongoose.Types.ObjectId(currentProfileId)
            ),
          },
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot execute Offboarding delete for %s`,
        offboardingId,
        err
      );
      throw new HttpException(
        'Cannot delete Offboarding',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return deletedOffboarding;
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
          OffboardingIds: [],
          farewellIds: [],
        };
        break;
      default:
        offboardingContentWithStatus = offboarding;
    }

    return offboardingContentWithStatus;
  }

  async createAnalyticsOffboarding(
    offboardingId: string,
    {
      offboardingId: _,
      profileId,
      ...restOffboardingAnalytics
    }: IExpOffboardingAnalytics
  ) {
    let updatedOffboarding;

    try {
      updatedOffboarding = await this.offboardingAnalyticsModel.create({
        ...restOffboardingAnalytics,
        offboardingId: new mongoose.Types.ObjectId(offboardingId),
        profileId: profileId ? new mongoose.Types.ObjectId(profileId) : null,
      });
    } catch (err) {
      console.error(`Cannot execute Offboarding update for`, err);
      throw new HttpException(
        'Cannot update Offboarding',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return updatedOffboarding;
  }
}
