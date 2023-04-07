import mongoose, { Schema, model } from 'mongoose';

//many to many
const standingSchema = new Schema({
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
 
  });

  const Standing = model('Standing', standingSchema);

export default Standing;