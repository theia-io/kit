import { FarewellStatus } from '@kitouch/shared-models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type FarewellDocument = HydratedDocument<Farewell>;

@Schema({
  timestamps: true,
  collection: 'farewell',
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
      delete ret._id;
    },
  },
})
export class Farewell {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KudoBoard',
  })
  kudoBoardId: Types.ObjectId | null;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  })
  profileId: Types.ObjectId;

  @Prop({
    default: '',
    trim: true,
  })
  title: string;

  @Prop({
    default: '',
    trim: true,
  })
  content: string;

  @Prop({
    type: String,
    enum: FarewellStatus,
  })
  status: FarewellStatus;
}

export const FarewellSchema = SchemaFactory.createForClass(Farewell);
