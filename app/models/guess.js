import mongoose, { Schema, model } from 'mongoose';

const guessSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet',
    required: true,
  },
  betamount: {
    type: Number,
    required: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },

  guess: {
    type: String,
    enum: ['home', 'away', 'tie'],
    default: null,
  },
  // 0 o 1 points for accuracy
  userPoints: {
    type: Number,
    default: 0,
  },
});

const Guess = model('Guess', guessSchema);

export default Guess;
