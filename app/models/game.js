import mongoose, { Schema, model } from 'mongoose';

const gameSchema = new Schema({
  league: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
  },
  homeTeam: {
    type: String,
    required: true,
  },
  awayTeam: {
    type: String,
    required: true,
  },

  startTime: {
    type: Date,
    required: true,
  },

  // it will store the name of the winner team according to the api response.
  result: {
    type: String,
    enum: ['home', 'away', 'tie'],
    default: null,
  },
});

const Game = model('Game', gameSchema);

export default Game;
