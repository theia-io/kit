import {
  Account,
  AccountDocument,
  Profile,
  ProfileDocument,
  User,
  UserDocument,
} from '@kitouch/be-db';
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

  //   async create(createCatDto: CreateCatDto): Promise<Cat> {
  //     const createdCat = new this.catModel(createCatDto);
  //     return createdCat.save();
  //   }

  async accountFindOne(email: string): Promise<AccountDocument | null> {
    let account;
    try {
      // check if will find many or INFORCE it with something
      account = await this.accountModel
        .findOne<AccountDocument>({ email })
        .exec();
      //   const accounts = await this.accountModel.find().exec();
      console.log('Accounts', account);
      //   account = accounts?.[0];
    } catch (err) {
      console.error('Cannot execute account search', err);
      throw new HttpException(
        'Cannot execute account search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return account;

    // console.log('account', account);

    // return this.accountModel.find().exec();
  }

  async userFindOne(accountId: string) {
    let user;
    console.log(
      ' new mongoose.Types.ObjectId(accountId)',
      accountId,
      new mongoose.Types.ObjectId(accountId)
    );
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

  async profileFindOne(userId: mongoose.Types.ObjectId) {
    let profile;
    try {
      // check if will find many or INFORCE it with something
      profile = await this.profileModel.findOne({ userId }).exec();
    } catch (err) {
      console.error('Cannot execute profile search', err);
      throw new HttpException(
        'Cannot execute profile search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return profile;
  }
}
