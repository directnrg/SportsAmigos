import { Schema, model } from 'mongoose';

const leagueSchema = new Schema({
 
});

const League = model('League', leagueSchema);

export default League;