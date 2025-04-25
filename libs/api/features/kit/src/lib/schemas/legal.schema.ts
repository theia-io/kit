import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LegalDocument = HydratedDocument<Legal>;

@Schema({
  timestamps: true,
  collection: 'legal',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret['_id'];
    },
  },
})
export class Legal {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  alias: string;
}

export const LegalSchema = SchemaFactory.createForClass(Legal);
