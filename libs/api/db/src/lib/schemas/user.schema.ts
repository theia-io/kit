// import mongoose from 'mongoose';
// const { Schema, model } = mongoose;

// export const userSchema = new Schema({
//   _id: mongoose.Types.ObjectId,
//   accountId: mongoose.Types.ObjectId,
//   name: String,
//   surname: String,
//   experiences: [
//     {
//       title: String,
//       company: String,
//       country: String,
//       type: String,
//       locationType: String,
//       startDate: Date,
//       endDate: Date,
//       description: String,
//       skills: String,
//       links: String,
//       media: [],
//     },
//   ],
// });

// export const User = model('user', userSchema);
// src/db/schemas/user.schema.ts (example path)
import { ExperienceType, LocationType } from '@kitouch/shared-models';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

// Define subdocument class for Experience
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true, // <<< ENSURE this is true (or omit, as true is default)
    versionKey: false, // Optional: Remove the __v field
    transform(doc, ret) {
      delete ret._id; // <<< Remove the original _id field from the output
      // You can add other transformations here if needed
    },
  },
}) // No separate _id for subdocuments unless needed
export class Experience {
  @Prop()
  title: string;

  @Prop()
  company: string;

  @Prop()
  country: string;

  @Prop()
  city: string;

  @Prop({ type: String, enum: ExperienceType })
  type: ExperienceType; // e.g., 'Full-time', 'Contract'

  @Prop({ type: String, enum: LocationType })
  locationType: LocationType; // e.g., 'On-site', 'Remote'

  @Prop()
  startDate: Date;

  @Prop({ type: Date }) // Make endDate optional
  endDate: Date;

  @Prop()
  description: string;

  @Prop({ type: [{ type: String }] }) // Assuming skills/links are comma-separated strings? Consider arrays.
  skills?: Array<string>;

  @Prop({ type: [{ type: String }] })
  links?: Array<string>;

  // media: [] -> Need to define the structure if you store media info here
  @Prop({ type: [{ type: String }] }) // Example: Array of anything
  media: Array<string>;
}
export const ExperienceSchema = SchemaFactory.createForClass(Experience);

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  collection: 'user',
  toJSON: {
    virtuals: true, // <<< ENSURE this is true (or omit, as true is default)
    versionKey: false, // Optional: Remove the __v field
    transform(doc, ret) {
      delete ret._id; // <<< Remove the original _id field from the output
      // You can add other transformations here if needed
    },
  },
}) // Adds createdAt and updatedAt automatically
export class User {
  // Link to the Account document
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    index: true,
  })
  accountId: Types.ObjectId; // Use Types.ObjectId for relation

  @Prop()
  name: string;

  @Prop()
  surname: string;

  // Embed the Experience subdocuments
  @Prop({ type: [ExperienceSchema], default: [] }) // Use the generated schema for the array type
  experiences: Experience[];
}

export const UserSchema = SchemaFactory.createForClass(User);
