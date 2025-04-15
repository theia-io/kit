import {
  Account,
  AccountDocument,
  Profile,
  ProfileDocument,
  User,
  UserDocument,
} from '@kitouch/be-db';
import { AccountStatus, AccountType, Auth0User } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class KitService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>
  ) {}

  async accountFindOne(email: string): Promise<AccountDocument | null> {
    let account;
    try {
      // check if will find many or INFORCE it with something
      account = await this.accountModel
        .findOne<AccountDocument>({ email })
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

  async accountFindOneAndUpdate(
    auth0User: Omit<Auth0User, 'account' | 'user' | 'profiles'>
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

      // check if will find many or INFORCE it with something
      account = await this.accountModel
        .findOneAndUpdate<AccountDocument>(
          { email: auth0UserEmail },
          updateOnInsert,
          options
        )
        .exec();
    } catch (err) {
      console.error('Cannot execute account findOneAndUpdate', err);
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

  async userFindOne(accountId: string) {
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

  async userFindOneAndUpdate(account: AccountDocument): Promise<UserDocument> {
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
      console.error('Cannot execute account findOneAndUpdate', err);
      throw new HttpException(
        'Cannot execute account search',
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

  async profileFind(userId: string) {
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

  async profilesFindOrInsert(
    user: UserDocument
  ): Promise<Array<ProfileDocument>> {
    const profiles: Array<ProfileDocument> | null = await this.profileFind(
      user.id
    );
    if (profiles && profiles.length > 0) {
      return profiles;
    }

    let profile;
    try {
      // check if will find many or INFORCE it with something
      profile = await this.profileModel.create({ userId: user._id });
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
}
