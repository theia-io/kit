import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const profileSchema = new Schema({
  _id: mongoose.Types.ObjectId,
  userId: mongoose.Types.ObjectId,
  name: String,
  pictures: [
    {
      url: String,
      primary: Boolean,
    },
  ],
  followers: [
    {
      id: String,
    },
  ],
  following: [
    {
      id: String,
    },
  ],
  alias: String,
  description: String,
  subtitle: String,
  title: String,
  socials: {
    linkedin: String,
    github: String,
    twitter: String,
    facebook: String,
    instagram: String,
    whatsapp: String,
    youtube: String,
  },
});

export const Profile = model('profile', profileSchema);
