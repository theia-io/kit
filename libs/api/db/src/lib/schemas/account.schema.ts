// import mongoose from 'mongoose';

// export const accountSchema = new mongoose.Schema({
//   _id: mongoose.Types.ObjectId,
//   userId: String,
//   settingsId: Boolean,
//   email: String,
//   type: String,
//   status: String,
//   data: {
//     last_name: String,
//     picture: String,
//     email: String,
//     name: String,
//     first_name: String,
//   },
//   customData: Object,
//   identities: [
//     {
//       id: String,
//       provider_type: String,
//     },
//   ],
//   //   createdAt: Date,
//   //   updatedAt: Date,
// });

// export const Account = mongoose.model('account', accountSchema);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose'; // Import mongoose for Types.ObjectId if needed

// Define interfaces for nested objects if desired (optional but good practice)
interface Identity {
  id: string;
  provider_type: string;
}

interface Data {
  last_name: string;
  picture: string;
  email: string;
  name: string;
  first_name: string;
}

export type AccountDocument = HydratedDocument<Account>;

@Schema({
  timestamps: true,
  collection: 'account',
  toJSON: {
    virtuals: true, // <<< ENSURE this is true (or omit, as true is default)
    versionKey: false, // Optional: Remove the __v field
    transform(doc, ret) {
      delete ret._id; // <<< Remove the original _id field from the output
      // You can add other transformations here if needed
    },
  },
})
export class Account {
  @Prop({ required: true, unique: true }) // Example: Make userId required and unique
  userId: string;

  @Prop({ required: true, unique: true, index: true }) // Add index for faster email lookups
  email: string;

  @Prop()
  type: string;

  @Prop()
  status: string;

  @Prop({ type: Object }) // Define nested objects using type: Object or a specific sub-schema
  data: Data; // Use the interface for type safety

  @Prop({ type: Object })
  customData: Record<string, any>; // Use Record<string, any> for a flexible object

  @Prop({ type: [{ id: String, provider_type: String }] }) // Define array of objects
  identities: Identity[]; // Use the interface for type safety
}

export const AccountSchema = SchemaFactory.createForClass(Account);
