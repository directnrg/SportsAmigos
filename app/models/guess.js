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
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    required: true,
  },
  guess: {
    type: String,
    enum: ['home', 'away', 'tie', null],
    default: null,
  },
  // 0 or 1 points for accuracy
  guessPoints: {
    type: Number,
    default: 0,
  },
   // Flag to track whether the guess points have already been calculated or not
   pointsCalculated: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Guess = model('Guess', guessSchema);

export default Guess;
