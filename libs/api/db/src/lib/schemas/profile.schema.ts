// import mongoose from 'mongoose';
// const { Schema, model } = mongoose;

// export const profileSchema = new Schema({
//   _id: mongoose.Types.ObjectId,
//   userId: mongoose.Types.ObjectId,
//   name: String,
//   pictures: [
//     {
//       url: String,
//       primary: Boolean,
//     },
//   ],
//   followers: [
//     {
//       id: String,
//     },
//   ],
//   following: [
//     {
//       id: String,
//     },
//   ],
//   alias: String,
//   description: String,
//   subtitle: String,
//   title: String,
//   socials: {
//     linkedin: String,
//     github: String,
//     twitter: String,
//     facebook: String,
//     instagram: String,
//     whatsapp: String,
//     youtube: String,
//   },
// });

// export const Profile = model('profile', profileSchema);
// export type IProfile = typeof Profile;
// src/db/schemas/profile.schema.ts (example path)
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
  // Link to the User document
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  })
  userId: Types.ObjectId;

  @Prop()
  name: string; // Likely duplicates User.name/surname - consider if needed

  @Prop({ type: [PictureSchema], default: [] })
  pictures: Picture[];

  // Assuming followers/following store IDs of OTHER User documents
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  followers: Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: [],
  })
  following: Types.ObjectId[];

  @Prop({ unique: true, sparse: true, index: true }) // Alias should likely be unique if used as a handle
  alias: string;

  @Prop()
  description: string;

  @Prop()
  subtitle: string;

  @Prop()
  title: string;

  @Prop({ type: SocialsSchema, default: {} }) // Use the sub-schema
  socials: Socials;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);

// !!! NO MANUAL mongoose.model() CALL HERE !!!
// !!! REMOVE export type IProfile = typeof Profile; !!! (Use Profile or ProfileDocument)
