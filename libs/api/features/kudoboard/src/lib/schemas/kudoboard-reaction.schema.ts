import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type KudoBoardReactionsDocument = HydratedDocument<KudoBoardReactions>;

@Schema({
  timestamps: true,
  collection: 'kudoboard-reactions',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret._id;
    },
  },
})
export class KudoBoardReactions {
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
  profileId: Types.ObjectId;

  @Prop({ required: true })
  content: string;
}

export const KudoBoardReactionsSchema =
  SchemaFactory.createForClass(KudoBoardReactions);
