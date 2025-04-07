import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Bookmark, BookmarkDocument } from './schemas';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

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
      console.error(`Cannot execute profileId search for ${profileId}`, err);
      throw new HttpException(
        'Cannot execute tweet feed search',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return bookmarks;
  }
}
