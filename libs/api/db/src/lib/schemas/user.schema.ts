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
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

// Define subdocument class for Experience
@Schema({ _id: false }) // No separate _id for subdocuments unless needed
export class Experience {
  @Prop()
  title: string;

  @Prop()
  company: string;

  @Prop()
  country: string;

  @Prop()
  type: string; // e.g., 'Full-time', 'Contract'

  @Prop()
  locationType: string; // e.g., 'On-site', 'Remote'

  @Prop()
  startDate: Date;

  @Prop({ type: Date, required: false }) // Make endDate optional
  endDate?: Date;

  @Prop()
  description: string;

  @Prop({ type: String, required: false }) // Assuming skills/links are comma-separated strings? Consider arrays.
  skills?: string;

  @Prop({ type: String, required: false })
  links?: string;

  // media: [] -> Need to define the structure if you store media info here
  @Prop({ type: [mongoose.Schema.Types.Mixed], default: [] }) // Example: Array of anything
  media: any[];
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
