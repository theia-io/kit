import { KudoBoardStatus } from '@kitouch/shared-models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

export type KudoBoardDocument = HydratedDocument<KudoBoard>;

@Schema({
  timestamps: true,
  collection: 'kudoboard',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      delete ret._id;
    },
  },
})
export class KudoBoard {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    // kudoboard can be created by anonymous user
    required: false,
  })
  profileId: Types.ObjectId;

  // TODO @Danylo remove & populate with DB (using mongoose)
  // @Prop()
  // profile: any;

  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop()
  recipient: string;

  @Prop()
  background: string;

  @Prop({
    type: String,
    enum: KudoBoardStatus,
  })
  status: KudoBoardStatus;
}

export const KudoBoardSchema = SchemaFactory.createForClass(KudoBoard);
