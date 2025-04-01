import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type AccountSettingsDocument = HydratedDocument<AccountSettings>;

@Schema({ timestamps: true, collection: 'accountSettings' }) // Explicit collection name
export class AccountSettings {
  // Link to the Account document (assuming a 1-to-1 relationship)
  // If _id should be the SAME as the Account _id, more complex setup needed.
  // If it's a separate document LINKED to Account:
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    unique: true,
  })
  accountId: Types.ObjectId;

  // Assuming subscriptions are just strings for now
  // If they are complex objects, define a subdocument schema
  @Prop({ type: [String], default: [] })
  subscriptions: string[];

  // Add other settings properties here with @Prop()
  // e.g., @Prop({ default: 'en' }) language: string;
}

export const AccountSettingsSchema =
  SchemaFactory.createForClass(AccountSettings);
