import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type TweetDocument = HydratedDocument<Tweet>;

@Schema({
  _id: false, // <<< Set _id to false if you DON'T need a separate MongoDB ObjectId for each comment within the array
  timestamps: true,
})
export class TweetComment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId, // Store as ObjectId
    ref: 'Profile', // Reference the 'Profile' model
    required: true,
    index: true, // Good to index if you query by commenter
  })
  profileId: Types.ObjectId; // Use Mongoose Types.ObjectId for refs

  @Prop({ required: true, trim: true }) // Add trim for content
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const TweetCommentSchema = SchemaFactory.createForClass(TweetComment);

@Schema({
  timestamps: true,
  collection: 'tweet',
  toJSON: {
    virtuals: true, // <<< ENSURE this is true (or omit, as true is default)
    versionKey: false, // Optional: Remove the __v field
    transform(doc, ret) {
      delete ret._id; // <<< Remove the original _id field from the output
      // You can add other transformations here if needed
    },
  },
})
export class Tweet {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  })
  profileId: Types.ObjectId;

  // TODO @FIXME DB has denormalization of the tweet so to avoid left join on Tweet API which is supposed to be the most bombarded :/ Potentially store "related profiles"
  // @Prop()
  // denormalization:

  @Prop({
    required: true,
  })
  content: string;

  @Prop()
  type: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  })
  upProfileIds: Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tweet',
  })
  referenceId: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  })
  referenceProfileId: string;

  @Prop({ type: [TweetCommentSchema], default: [] }) // Use the TweetCommentSchema in an array type
  comments: TweetComment[];
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);
