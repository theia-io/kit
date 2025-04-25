import { ToastModule } from 'primeng/toast';
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
        .populate('kudoBoardId')
        .populate('profileId')
        .exec();
    } catch (err) {
      console.error(`Cannot execute farewell search for %s`, profileId, err);
      throw new HttpException(
        'Cannot find farewells',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return farewells.map((farewell) => {
      const farewellObject = farewell.toObject() as any; // TODO Come up with a better OR better even to redo kudoBoardId and profileId in the Farewell schema to

      return {
        ...farewellObject,
        kudoBoardId: farewellObject.kudoBoardId?._id,
        kudoBoard: farewellObject.kudoBoardId?._id
          ? {
              ...farewellObject.kudoBoardId,
              id: farewellObject.kudoBoardId?._id,
            }
          : null,
        profileId: farewellObject.profileId?._id,
        profile: {
          ...farewellObject.profileId,
          id: farewellObject.profileId?._id,
        },
      } as IFarewell;
    });
  }

  async getFarewell(farewellId: string) {
    let farewell;

    try {
      farewell = await this.farewellModel
        .findOne({
          _id: new mongoose.Types.ObjectId(farewellId),
        })
        .populate('kudoBoardId')
        .populate('profileId')
        .exec();
    } catch (err) {
      console.error(`Cannot execute farewell search for %s`, farewellId, err);
      throw new HttpException(
        'Cannot run farewell search correctly',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (!farewell) {
      return null;
    }

    const farewellObject = farewell.toObject() as any; // TODO Come up with a better OR better even to redo kudoBoardId and profileId in the Farewell schema to

    // TODO This will be refactored once the Farewell schema is refactored to use the new KudoBoard and Profile schemas.
    return {
      ...farewellObject,
      kudoBoardId: farewellObject.kudoBoardId?._id,
      kudoBoard: farewellObject.kudoBoardId?._id
        ? {
            ...farewellObject.kudoBoardId,
            id: farewellObject.kudoBoardId?._id,
          }
        : null,
      profileId: farewellObject.profileId?._id,
      profile: {
        ...farewellObject.profileId,
        id: farewellObject.profileId?._id,
      },
    } as IFarewell;
  }

  async createFarewell({
    kudoBoardId,
    profileId,
    title,
    content,
    status,
  }: IFarewell) {
    let newFarewell;

    try {
      newFarewell = await this.farewellModel.create({
        title,
        content,
        status,
        kudoBoardId: kudoBoardId
          ? new mongoose.Types.ObjectId(kudoBoardId)
          : null,
        profileId: profileId ? new mongoose.Types.ObjectId(profileId) : null,
      });
    } catch (err) {
      console.error(
        `Cannot execute farewell create for %s, %s, %s, %s, %s`,
        title,
        content,
        status,
        kudoBoardId,
        profileId,
        err
      );
      throw new HttpException(
        'Cannot run create farewell',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (!newFarewell) {
      console.warn(`Farewell was not created.`);
      throw new HttpException(
        `Farewell was not created.`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return newFarewell;
  }

  async updateFarewell(
    farewellId: string,
    { title, content, status, kudoBoardId }: Omit<IFarewell, 'id'>,
    currentProfileIds: Array<string>
  ) {
    let updatedFarewell;

    try {
      updatedFarewell = await this.farewellModel
        .findOneAndUpdate(
          {
            _id: new mongoose.Types.ObjectId(farewellId),
            profileId: {
              $in: currentProfileIds.map(
                (currentProfileId) =>
                  new mongoose.Types.ObjectId(currentProfileId)
              ),
            },
          },
          {
            title,
            content,
            status,
            kudoBoardId: kudoBoardId
              ? new mongoose.Types.ObjectId(kudoBoardId)
              : null,
          },
          { new: true }
        )
        .exec();
    } catch (err) {
      console.error(`Cannot execute farewell update for %s`, farewellId, err);
      throw new HttpException(
        'Cannot update farewell',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (!updatedFarewell) {
      console.warn(
        `Farewell ${farewellId} not found or not authorized for update by provided profiles.`
      );
      throw new HttpException(
        `Farewell message with ID "${farewellId}" not found or you lack permission.`,
        HttpStatus.NOT_FOUND
      );
    }

    return updatedFarewell;
  }

  async deleteFarewell(
    farewellId: string,
    currentCallerProfileIds: Array<string>
  ) {
    let deletedFarewell;

    try {
      deletedFarewell = await this.farewellModel.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(farewellId),
        profileId: {
          $in: currentCallerProfileIds.map(
            (currentCallerProfileId) =>
              new mongoose.Types.ObjectId(currentCallerProfileId)
          ),
        },
      });
    } catch (err) {
      console.error(`Cannot execute farewell delete for %s`, farewellId, err);
      throw new HttpException(
        'Cannot delete farewell',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    if (!deletedFarewell) {
      // This means EITHER the farewellId didn't exist OR its profileId wasn't in the requestingProfileObjectIds array.
      // Throwing NotFound is generally safer than Forbidden.
      console.warn(
        `Farewell ${farewellId} not found or not authorized for deletion by provided profiles.`
      );
      throw new HttpException(
        `Farewell message with ID "${farewellId}" not found or you lack permission.`,
        HttpStatus.NOT_FOUND
      );
    }

    return deletedFarewell;
  }
}
