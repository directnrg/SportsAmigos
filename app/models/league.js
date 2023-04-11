import mongoose, { Schema, model } from 'mongoose';

const leagueSchema = new Schema({
  users: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    validate: {
      validator: function (users) {
        return users.length <= 7;
      },
      message: 'Maximum of 7 users are allowed in a league',
    },
  },
  name: {
    type: String,
    required: true,
  },
  guesses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Guess',
    },
  ],
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
  ],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  endDate: {
    type: Date,
    default: null,
  },
});

const League = model('League', leagueSchema);

export default League;
