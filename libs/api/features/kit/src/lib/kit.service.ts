import {
  Account,
  AccountDocument,
  Profile,
  ProfileDocument,
  User,
  UserDocument,
} from '@kitouch/be-db';
import {
  AccountStatus,
  AccountType,
  Auth0User,
  Experience,
  Profile as IProfile,
  User as IUser,
} from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Legal, LegalDocument } from './schemas';

@Injectable()
export class KitService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(Legal.name) private legalModel: Model<LegalDocument>
  ) {}

  async accountByEmail(email: string): Promise<AccountDocument | null> {
    let account;
    try {
      // check if will find many or INFORCE it with something
      account = await this.accountModel
        .findOne<AccountDocument>({ email: { $eq: email } })
        .exec();
    } catch (err) {
      console.error('Cannot execute account search', err);
      throw new HttpException(
        'Cannot execute account search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return account;
  }

  async deleteAccount(accountId: string): Promise<boolean> {
    try {
      // check if will find many or INFORCE it with something
      await this.accountModel
        .findOneAndDelete<AccountDocument>({
          _id: new mongoose.Types.ObjectId(accountId),
        })
        .exec();
    } catch (err) {
      console.error('Cannot execute account deleting', err);
      throw new HttpException(
        'Cannot execute account delete',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return true;
  }

  async auth0AccountFindAndUpdate(
    auth0User: Auth0User
  ): Promise<AccountDocument> {
    const auth0UserEmail = auth0User.email.toLowerCase();
    let account: AccountDocument | null;

    try {
      // Data to set ONLY if a new document is inserted
      const updateOnInsert = {
        $setOnInsert: {
          customData: auth0User,
          type: AccountType.USER,
          status: AccountStatus.ACTIVE,
          email: auth0UserEmail,
        },
      };

      const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      };

      console.log(auth0UserEmail, updateOnInsert);

      // check if will find many or INFORCE it with something
      account = await this.accountModel
        .findOneAndUpdate<AccountDocument>(
          { email: auth0UserEmail },
          updateOnInsert,
          options
        )
        .exec();
    } catch (err) {
      console.error(
        '[auth0AccountFindAndUpdate] Cannot execute account findOneAndUpdate',
        err
      );
      throw new HttpException(
        'Cannot execute account search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // findOneAndUpdate returns null if upsert:false and not found, but with upsert:true
    // it should always return the found or newly created document.
    if (account === null) {
      throw new HttpException(
        'Account not found',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return account;
  }

  async accountUser(accountId: string) {
    let user;
    try {
      // check if will find many or INFORCE it with something
      user = await this.userModel
        .findOne<UserDocument>({
          accountId: new mongoose.Types.ObjectId(accountId),
        })
        .exec();
    } catch (err) {
      console.error('Cannot execute user search', err);
      throw new HttpException(
        'Cannot execute user search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return user;
  }

  async deleteUser(accountId: string) {
    let user;
    try {
      // check if will find many or INFORCE it with something
      user = await this.userModel
        .findOneAndDelete<UserDocument>({
          accountId: new mongoose.Types.ObjectId(accountId),
        })
        .exec();
    } catch (err) {
      console.error('Cannot execute user delete', err);
      throw new HttpException(
        'Cannot execute user delete',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return user;
  }

  async accountUserFindAndUpdate(
    account: AccountDocument
  ): Promise<UserDocument> {
    let user: UserDocument | null;

    try {
      // Data to set ONLY if a new document is inserted
      const updateOnInsert = {
        $setOnInsert: {
          accountId: account._id,
        },
      };

      const options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      };

      // check if will find many or INFORCE it with something
      user = await this.userModel
        .findOneAndUpdate<UserDocument>(
          { accountId: account._id },
          updateOnInsert,
          options
        )
        .exec();
    } catch (err) {
      console.error(
        '[accountUserFindAndUpdate] Cannot execute user findOneAndUpdate',
        err
      );
      throw new HttpException(
        'Cannot execute user search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // findOneAndUpdate returns null if upsert:false and not found, but with upsert:true
    // it should always return the found or newly created document.
    if (user === null) {
      throw new HttpException(
        'User not found',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return user;
  }

  async getUser(userId: string) {
    let user: UserDocument | null;

    try {
      user = await this.userModel
        .findOne<UserDocument>({ _id: new mongoose.Types.ObjectId(userId) })
        .exec();
    } catch (err) {
      console.error(`Cannot get user %s`, userId, err);
      throw new HttpException(
        'Cannot get user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return user;
  }

  async addUserExperience(userId: string, experience: Experience) {
    let updatedUser: UserDocument | null;

    try {
      updatedUser = await this.userModel
        .findOneAndUpdate<UserDocument>(
          { _id: new mongoose.Types.ObjectId(userId) },
          {
            $push: {
              experiences: experience,
            },
          },
          { new: true }
        )
        .exec();
    } catch (err) {
      console.error(
        `Cannot add user experiences %s, %s`,
        userId,
        JSON.stringify(experience),
        err
      );
      throw new HttpException(
        'Cannot add user experience',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    console.log('updatedUser', updatedUser);

    return updatedUser;
  }

  async deleteUserExperience(userId: string, experienceId: Experience['id']) {
    let updatedUser: UserDocument | null;

    try {
      updatedUser = await this.userModel
        .findOneAndUpdate<UserDocument>(
          {
            _id: new mongoose.Types.ObjectId(userId),
            experiences: {
              $elemMatch: {
                _id: new mongoose.Types.ObjectId(experienceId),
              },
            },
          },
          {
            $pull: {
              experiences: {
                _id: new mongoose.Types.ObjectId(experienceId),
              },
            },
          },
          { new: true }
        )
        .exec();
    } catch (err) {
      console.error(
        `Cannot delete user experience %s, %s`,
        userId,
        experienceId,
        err
      );
      throw new HttpException(
        'Cannot delete user experience',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return updatedUser;
  }

  async userProfiles(userId: string) {
    let profile: Array<ProfileDocument> | null;

    try {
      // check if will find many or INFORCE it with something
      profile = await this.profileModel
        .find<ProfileDocument>({ userId: new mongoose.Types.ObjectId(userId) })
        .exec();
    } catch (err) {
      console.error('Cannot execute profile search', err);
      throw new HttpException(
        'Cannot execute profile search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return profile;
  }

  async deleteProfiles(userId: string) {
    try {
      // check if will find many or INFORCE it with something
      await this.profileModel
        .findByIdAndDelete<ProfileDocument>({
          userId: new mongoose.Types.ObjectId(userId),
        })
        .exec();
    } catch (err) {
      console.error('Cannot execute profile search', err);
      throw new HttpException(
        'Cannot execute profile search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return true;
  }

  async profilesFindOrInsert(
    user: UserDocument,
    auth0Updates: Pick<Auth0User, 'name' | 'picture'>
  ): Promise<Array<ProfileDocument>> {
    const profiles: Array<ProfileDocument> | null = await this.userProfiles(
      user.id
    );
    if (profiles && profiles.length > 0) {
      return profiles;
    }

    let profile;
    try {
      // check if will find many or INFORCE it with something
      profile = await this.profileModel.create({
        userId: user._id,
        name: auth0Updates.name,
        pictures: [
          {
            url: auth0Updates.picture,
            primary: true,
          },
        ],
      });
    } catch (err) {
      console.error('Cannot add new profile', err);
      throw new HttpException(
        'Cannot add new profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    // findOneAndUpdate returns null if upsert:false and not found, but with upsert:true
    // it should always return the found or newly created document.
    if (profile === null) {
      throw new HttpException(
        'Profile not found and not created',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return [profile];
  }

  async suggestProfilesToFollow(currentUser: IUser) {
    let allUsers: Array<UserDocument> | null;

    try {
      allUsers = await this.userModel
        .find<UserDocument>({
          _id: { $ne: new mongoose.Types.ObjectId(currentUser.id) },
        })
        .exec();
    } catch (err) {
      console.error('Cannot execute user search', err);
      throw new HttpException(
        'Cannot execute user search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    const getExperienceIntersection = (
      { startDate: s1, endDate: e1 }: Omit<Experience, 'id'>,
      { startDate: s2, endDate: e2 }: Omit<Experience, 'id'>
    ) => {
      const NOW = new Date();

      const s1Number = new Date(s1).getTime(),
        e1Number = (e1 ? new Date(e1) : NOW).getTime(),
        s2Number = new Date(s2).getTime(),
        e2Number = (e2 ? new Date(e2) : NOW).getTime();

      return (
        (s1Number - s2Number >= 0 && e2Number - s1Number >= 0) ||
        (s2Number - s1Number >= 0 && e1Number - s2Number >= 0)
      );
    };

    const matchingUsers = allUsers.filter((anotherUser) =>
      currentUser.experiences?.some((thisUserExperience) =>
        anotherUser.experiences?.some((anotherUserExperience) =>
          getExperienceIntersection(thisUserExperience, anotherUserExperience)
        )
      )
    );

    const matchingUsersIds = matchingUsers.map(
      (matchingUser) => matchingUser._id
    );

    let matchingUserProfiles;
    try {
      matchingUserProfiles = await this.profileModel
        .aggregate([
          {
            $match: {
              userId: { $in: matchingUsersIds },
            },
          },
        ])
        .exec();
    } catch (err) {
      console.error('Cannot execute profile search', err);
      throw new HttpException(
        'Cannot execute profile search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return matchingUserProfiles.map(({ _id, ...matchingUserProfile }) => ({
      id: _id,
      ...matchingUserProfile,
    }));
  }

  async profiles(profileIds: Array<string>) {
    let profiles: Array<ProfileDocument> | null;

    try {
      // check if will find many or INFORCE it with something
      profiles = await this.profileModel
        .find<ProfileDocument>({
          _id: { $in: profileIds.map((id) => new mongoose.Types.ObjectId(id)) },
        })
        .exec();
    } catch (err) {
      console.error('Cannot execute profile search', err);
      throw new HttpException(
        'Cannot execute profile search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return profiles;
  }

  async updateProfile(profile: IProfile) {
    let updatedProfile: ProfileDocument | null;

    try {
      updatedProfile = await this.profileModel
        .findOneAndUpdate<ProfileDocument>(
          { _id: new mongoose.Types.ObjectId(profile.id) },
          {
            $set: {
              ...profile,
            },
          },
          { new: true }
        )
        .exec();
    } catch (err) {
      console.error('Cannot update profile', err);
      throw new HttpException(
        'Cannot update profile',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return updatedProfile;
  }

  async companies() {
    let companies: Array<LegalDocument> | null;

    try {
      // check if will find many or INFORCE it with something
      companies = await this.legalModel.find<LegalDocument>().exec();
    } catch (err) {
      console.error('Cannot get companies', err);
      throw new HttpException(
        'Cannot get companies',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return companies;
  }

  async addCompanies(companies: Array<Pick<Legal, 'alias' | 'name'>>) {
    let newCompanies: Array<LegalDocument> | null;

    try {
      newCompanies = await this.legalModel.insertMany(companies);
    } catch (err) {
      console.error('Cannot add company', err);
      throw new HttpException(
        'Cannot add new legal entity',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return newCompanies;
  }
}
