import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type FarewellAnalyticsDocument = HydratedDocument<FarewellAnalytics>;

@Schema({
  timestamps: true,
  collection: 'farewell-analytics',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret._id;
    },
  },
})
export class FarewellAnalytics {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farewell',
    required: true,
  })
  farewellId: Types.ObjectId;

  @Prop({
    type: Number,
    required: true,
  })
  viewed: number;
}

export const FarewellAnalyticsSchema =
  SchemaFactory.createForClass(FarewellAnalytics);
