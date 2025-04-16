import { Bookmark as IBookmark } from '@kitouch/shared-models';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Bookmark, BookmarkDocument } from './schemas';

@Injectable()
export class BeBookmarksService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<BookmarkDocument>
  ) {}

  async getBookmarks(profileId: string) {
    let bookmarks;

    try {
      bookmarks = await this.bookmarkModel
        .find<BookmarkDocument>({
          profileIdBookmarker: new mongoose.Types.ObjectId(profileId),
        })
        .exec();
    } catch (err) {
      console.error(`Cannot run bookmark search for ${profileId}`, err);
      throw new HttpException(
        'Cannot execute bookmark search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return bookmarks;
  }

  async getBookmark(bookmarkId: string) {
    let bookmark;

    try {
      bookmark = await this.bookmarkModel
        .findOne<BookmarkDocument>({
          _id: new mongoose.Types.ObjectId(bookmarkId),
        })
        .exec();
    } catch (err) {
      console.error(`Cannot execute bookmark find for ${bookmarkId}`, err);
      throw new HttpException(
        'Cannot execute bookmark search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return bookmark;
  }

  async newBookmark({
    tweetId,
    profileIdBookmarker,
    profileIdTweetyOwner,
  }: Partial<IBookmark>) {
    let newBookmark;

    try {
      newBookmark = await this.bookmarkModel.create({
        tweetId: new mongoose.Types.ObjectId(tweetId),
        profileIdBookmarker: new mongoose.Types.ObjectId(profileIdBookmarker),
        profileIdTweetyOwner: new mongoose.Types.ObjectId(profileIdTweetyOwner),
      });
    } catch (err) {
      console.error(
        `Cannot create new bookmark ${JSON.stringify(newBookmark)}`,
        err
      );
      throw new HttpException(
        'Cannot create bew bookmark',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return newBookmark;
  }

  async deleteBookmark(bookmarkId: string, loggedInProfiles: Array<string>) {
    const bookmark = await this.getBookmark(bookmarkId);
    if (!bookmark) {
      throw new HttpException('bookmark not found', HttpStatus.NOT_FOUND);
    }

    if (
      !loggedInProfiles.some(
        (loggedInProfileId) =>
          bookmark?.profileIdBookmarker.toString() === loggedInProfileId
      )
    ) {
      throw new HttpException(
        'You can delete only yours bookmark',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      await bookmark.deleteOne();
    } catch (err) {
      console.error(`Cannot delete bookmark ${bookmarkId}`, err);
      throw new HttpException(
        'Cannot delete bookmark',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return true;
  }

  async deleteTweetFromBookmarks(tweetId: string, profileIdBookmarker: string) {
    try {
      await this.bookmarkModel
        .deleteOne({
          tweetId: new mongoose.Types.ObjectId(tweetId),
          profileIdBookmarker: new mongoose.Types.ObjectId(profileIdBookmarker),
        })
        .exec();
    } catch (err) {
      console.error(
        `Cannot delete tweet bookmark ${tweetId}, ${profileIdBookmarker}`,
        err
      );
      throw new HttpException(
        'Cannot find and delete bookmark',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return true;
  }

  async deleteAllTweetBookmarks(tweetId: string) {
    try {
      await this.bookmarkModel
        .deleteMany({
          tweetId: new mongoose.Types.ObjectId(tweetId),
        })
        .exec();
    } catch (err) {
      console.error(`Cannot delete tweet bookmarks ${tweetId}`, err);
      throw new HttpException(
        'Cannot find and delete bookmarks',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return true;
  }
}
