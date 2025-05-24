import { ExpOffboardingStatus } from '@kitouch/shared-models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type ExpOffboardingDocument = HydratedDocument<ExpOffboarding>;

@Schema({
  timestamps: true,
  collection: 'exp-offboardings',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret['_id'];
    },
  },
})
export class ExpOffboarding {
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'KudoBoard',
    required: true,
  })
  kudoboardIds: Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Farewell',
    required: true,
  })
  farewellIds: Types.ObjectId[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  })
  profileId: Types.ObjectId;

  @Prop()
  collaboratorEmails: Array<string>;

  @Prop()
  receiverEmail: string;

  @Prop({
    default: '',
    trim: true,
  })
  content: string;

  @Prop({
    type: String,
    enum: ExpOffboardingStatus,
  })
  status: ExpOffboardingStatus;
}

export const ExpOffboardingSchema =
  SchemaFactory.createForClass(ExpOffboarding);
