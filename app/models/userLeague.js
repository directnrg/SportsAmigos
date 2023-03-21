import { Schema, model } from 'mongoose';

//many to many
const userLeagueSchema = new mongoose.Schema({
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