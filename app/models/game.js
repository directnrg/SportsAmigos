import mongoose, { Schema, model } from 'mongoose';

const gameSchema = new Schema({
  //fixture Id will be the fixture id retrieved from the api
  fixtureId:  {
    type: String,
    required: true
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
    enum: ['home', 'away', 'tie', null],
    default: null,
  },
});

const Game = model('Game', gameSchema);

export default Game;
