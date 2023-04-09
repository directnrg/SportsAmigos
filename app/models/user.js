import mongoose, { model, Schema } from 'mongoose';

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phone: {
    type: String,
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  leagues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    default:null
  }],
});

const User = model('User', userSchema);

export default User;