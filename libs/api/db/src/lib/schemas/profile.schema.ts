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

@Schema({
  timestamps: true,
  collection: 'profile',
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
      // ret['following'] = ret['following']?.map((f: any) => ({ id: f._id?.toString() }));
      delete ret['_id'];
    },
  },
})
export class Profile {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: [PictureSchema], default: [] })
  pictures: Picture[];

  @Prop()
  following: [{ id: string }];

  // TODO migrate following [{ id: string }] to followingV2 Types.ObjectId[]. For this we will need to use https://www.npmjs.com/package/migrate-mongo or similar.
  // @Prop({
  //   type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' } ],
  //   default: [],
  // })
  // followingV2: Types.ObjectId[];

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
