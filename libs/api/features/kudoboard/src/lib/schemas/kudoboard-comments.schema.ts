import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type KudoBoardCommentsDocument = HydratedDocument<KudoBoardComments>;

@Schema({
  timestamps: true,
  collection: 'kudoboard-comments',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret._id;
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret._id;
    },
  },
})
export class KudoBoardComments {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KudoBoard',
    required: true,
  })
  kudoBoardId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  })
  profileId: Types.ObjectId | null;

  @Prop()
  content: string;

  @Prop({ type: [Object] })
  medias: Array<{
    url: string;
    width: number;
    height: number;
    optimizedUrls: Array<string>;
  }>;
}

export const KudoBoardCommentsSchema =
  SchemaFactory.createForClass(KudoBoardComments);
