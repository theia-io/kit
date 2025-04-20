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

  // TODO @Danylo remove & populate with DB
  // @Prop()
  // kudoBoard: any;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  })
  profileId: Types.ObjectId;

  // TODO @Danylo remove & populate with DB
  // @Prop()
  // profile: any;

  // TODO @Alex not sure about this type
  @Prop({
    type: String,
    enum: FarewellStatus,
  })
  status: FarewellStatus;
}

export const FarewellSchema = SchemaFactory.createForClass(Farewell);
