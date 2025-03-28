import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  userId: String,
  settingsId: Boolean,
  email: String,
  type: String,
  status: String,
  data: {
    last_name: String,
    picture: String,
    email: String,
    name: String,
    first_name: String,
  },
  customData: Object,
  identities: [
    {
      id: String,
      provider_type: String,
    },
  ],
  //   createdAt: Date,
  //   updatedAt: Date,
});

export const Account = mongoose.model('account', accountSchema);
