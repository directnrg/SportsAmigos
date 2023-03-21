import mongoose, { Schema, model } from 'mongoose';

//many to many
const userLeagueSchema = new Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    league: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'League',
      required: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    betAmount: {
      type: Number,
      default: 0,
    },
  });

  const UserLeague = model('UserLeague', userLeagueSchema);

export default UserLeague;