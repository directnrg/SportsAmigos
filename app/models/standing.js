import mongoose, { Schema, model } from 'mongoose';

const standingSchema = new Schema({
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true,
  },
  standings: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      points: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const Standing = model('Standing', standingSchema);

export default Standing;
