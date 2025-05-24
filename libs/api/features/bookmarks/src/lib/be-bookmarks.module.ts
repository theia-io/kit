import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BeBookmarksController } from './be-bookmarks.controller';
import { BeBookmarksService } from './be-bookmarks.service';
import { Bookmark, BookmarkSchema } from './schemas/bookmarks.schema';

@Module({
  controllers: [BeBookmarksController],
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Bookmark.name,
        useFactory: () => BookmarkSchema,
      },
    ]),
  ],
  providers: [BeBookmarksService],
  exports: [BeBookmarksService],
})
export class BeBookmarksModule {}
