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
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  funds: {
    type: Number,
    default: 0
  },
  leagues: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League'
  }],
  paymentMethods: {
    type: [String],
    default: []
  },
});

const User = model('User', userSchema);

export default User;