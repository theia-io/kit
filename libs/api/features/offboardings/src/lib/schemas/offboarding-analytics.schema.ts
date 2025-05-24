import { AnalyticsEvent } from '@kitouch/shared-models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type ExpOffboardingAnalyticsDocument =
  HydratedDocument<ExpOffboardingAnalytics>;

@Schema({
  timestamps: true,
  collection: 'exp-offboardings-analytics',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret['_id'];
    },
  },
})
export class ExpOffboardingAnalytics {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpOffboarding',
    required: true,
  })
  offboardingId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  })
  profileId: Types.ObjectId;

  @Prop({
    type: String,
    enum: AnalyticsEvent,
  })
  event: AnalyticsEvent;
}

export const ExpOffboardingAnalyticsSchema = SchemaFactory.createForClass(
  ExpOffboardingAnalytics
);
