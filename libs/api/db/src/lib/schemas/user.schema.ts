import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  accountId: mongoose.Types.ObjectId,
  name: String,
  surname: String,
  experiences: [
    {
      title: String,
      company: String,
      country: String,
      type: String,
      locationType: String,
      startDate: Date,
      endDate: Date,
      description: String,
      skills: String,
      links: String,
      media: [],
    },
  ],
});

export const User = model('user', userSchema);
