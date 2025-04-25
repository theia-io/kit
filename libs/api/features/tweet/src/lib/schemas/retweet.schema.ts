import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type ReTweetDocument = HydratedDocument<ReTweet>;

@Schema({
  timestamps: true,
  collection: 'retweet',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret['_id'];
    },
  },
})
export class ReTweet {
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
  profileId: Types.ObjectId;
}

export const ReTweetSchema = SchemaFactory.createForClass(ReTweet);
