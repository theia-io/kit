import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type FarewellCommentsDocument = HydratedDocument<FarewellComments>;

@Schema({
  timestamps: true,
  collection: 'farewell-comments',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret._id;
    },
  },
})
export class FarewellComments {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farewell',
    required: true,
  })
  farewellId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  })
  profileId: Types.ObjectId;

  @Prop({ required: true })
  content: string;
}

export const FarewellCommentsSchema =
  SchemaFactory.createForClass(FarewellComments);
