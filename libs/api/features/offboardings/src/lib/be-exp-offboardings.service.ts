import {
  ExpOffboardingStatus,
  ExpOffboarding as IExpOffboarding,
  Profile,
} from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ExpOffboarding, ExpOffboardingDocument } from './schemas';

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
        .populate('profileId')
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

    return offboardings.map((offboarding) =>
      populatedProfile(offboarding.toObject() as any)
    ) as Array<IExpOffboarding>;
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

    if (!offboarding) {
      throw new HttpException('Cannot find offboarding', HttpStatus.NOT_FOUND);
    }

    return populatedProfile(
      filterOffboardingContentForStatus(
        currentProfileIds,
        offboarding.toObject() as any
      ) as any
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
      kudoboardIds: __,
      farewellIds: _,
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
            // kudoboardIds: kudoboardIds?.map(
            //   (id) => new mongoose.Types.ObjectId(id)
            // ),
            // farewellIds: farewellIds?.map(
            //   (id) => new mongoose.Types.ObjectId(id)
            // ),
            profileIdsNetwork: profileIdsNetwork?.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
          { new: true }
        )
        .populate('profileId')
        .exec();
    } catch (err) {
      console.error(`Cannot execute Offboarding update for`, err);
      throw new HttpException(
        'Cannot update Offboarding',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return populatedProfile(updatedOffboarding as any);
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
}

// TODO IMPLEMENT ME
const filterOffboardingContentForStatus = (
  currentProfileIds: Array<string>,
  offboarding: IExpOffboarding
) => {
  console.log(
    `Filtering offboarding content for status, currentProfileIds: ${currentProfileIds}, offboarding: ${JSON.stringify(
      offboarding
    )}`
  );

  let offboardingContentWithStatus = offboarding;
  switch (offboarding?.status) {
    case ExpOffboardingStatus.Draft:
      offboardingContentWithStatus = {
        ...offboarding,
        content: '',
        farewellIds: [],
        kudoboardIds: [],
        collaboratorEmails: [],
        receiverEmail: '',
        profileIdsNetwork: [],
      };
      break;
    default:
      offboardingContentWithStatus = offboarding;
  }

  return offboardingContentWithStatus;
};

// TODO move to utils
const populatedProfile = (
  offboarding: Omit<IExpOffboarding, 'profile' | 'profileId'> & {
    profileId: Profile;
  }
): IExpOffboarding => {
  const { profileId } = offboarding;
  return {
    ...offboarding,
    profileId: profileId.id,
    profile: profileId,
  };
};
