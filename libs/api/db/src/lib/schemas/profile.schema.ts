import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

// Subdocument for Picture
@Schema({ _id: false })
export class Picture {
  @Prop({ required: true })
  url: string;

  @Prop({ default: false })
  primary: boolean;
}
export const PictureSchema = SchemaFactory.createForClass(Picture);

// Subdocument for Socials (can also be done inline)
@Schema({ _id: false })
export class Socials {
  @Prop() linkedin?: string;
  @Prop() github?: string;
  @Prop() twitter?: string;
  @Prop() facebook?: string;
  @Prop() instagram?: string;
  @Prop() whatsapp?: string;
  @Prop() youtube?: string;
}
export const SocialsSchema = SchemaFactory.createForClass(Socials);

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true, collection: 'profile' })
export class Profile {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: [PictureSchema], default: [] })
  pictures: Picture[];

  // Assuming followers/following store IDs of OTHER User documents
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
    default: [],
  })
  followers: Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
    default: [],
  })
  following: Types.ObjectId[];

  @Prop({ unique: true, sparse: true, index: true })
  alias: string;

  @Prop()
  description: string;

  @Prop()
  subtitle: string;

  @Prop()
  title: string;

  @Prop({ type: SocialsSchema, default: {} })
  socials: Socials;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
