import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type FarewellCommentDocument = HydratedDocument<FarewellComment>;

@Schema({
  timestamps: true,
  collection: 'farewell-comments',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret['_id'];
    },
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret['_id'];
    },
  },
})
export class FarewellComment {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farewell',
    required: true,
  })
  farewellId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: false,
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

export const FarewellCommentSchema =
  SchemaFactory.createForClass(FarewellComment);
