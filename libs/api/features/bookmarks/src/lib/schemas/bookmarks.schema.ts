import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type BookmarkDocument = HydratedDocument<Bookmark>;

@Schema({
  timestamps: true,
  collection: 'bookmark',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret['_id'];
    },
  },
})
export class Bookmark {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
    required: true,
  })
  tweetId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  })
  profileIdTweetyOwner: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  })
  profileIdBookmarker: Types.ObjectId;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
