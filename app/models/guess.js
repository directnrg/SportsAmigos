import mongoose, { Schema, model } from 'mongoose';

const guessSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  // 0 or 1 points for accuracy
  userPoints: {
    type: Number,
    default: 0,
  },
});

const Guess = model('Guess', guessSchema);

export default Guess;
