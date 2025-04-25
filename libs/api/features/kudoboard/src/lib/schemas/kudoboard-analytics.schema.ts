import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type KudoBoardAnalyticsDocument = HydratedDocument<KudoBoardAnalytics>;

@Schema({
  timestamps: true,
  collection: 'kudoboard-analytics',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret['_id'];
    },
  },
})
export class KudoBoardAnalytics {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KudoBoard',
    required: true,
  })
  kudoBoardId: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  event: string;
}

export const KudoBoardAnalyticsSchema =
  SchemaFactory.createForClass(KudoBoardAnalytics);
