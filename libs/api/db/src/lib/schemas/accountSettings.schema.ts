import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const accountSettingsSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  subscriptions: [],
});

export const AccountSettings = model('accountSettings', accountSettingsSchema);
