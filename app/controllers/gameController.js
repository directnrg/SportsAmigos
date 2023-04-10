import Game from '../models/game.js';
import axios from 'axios';
import dotenv from 'dotenv';
import cron from 'node-cron';

//config environment variables
dotenv.config()

// API KEY AND HOST global
const apiKey = process.env.API_SPORTS_KEY;
const apiHost = process.env.API_SPORTS_HOST;

//GLOBAL VARIABLES
//league - MEXICAN LEAGUE
const MEXICAN_LEAGUE = 262;
const SEASON_MEXICAN_LEAGUE = 2022;

// Get all games - if needed
export const getGames = async (req, res) => {
  try {
    const games = await Game.find({});
    res.status(200).json({ games });
  } catch (error) {
    res.status(400).json({ error });
  }
};

export const getGameById = async (req,res) => {
  try {
    const game = req.game
    res.status(200).json(game);
  } catch (error) {
    res.status(400).json({ error: error });
  }
}

/**
 * To populate games with api call without the need of cron or scheduled call.
 * calling this method will populate games from the sports api once. the games to be populated 
 * are going to be the current games of the current week.
 */
export const populateGames = async (req, res) => {

  try {
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -5 : 1)); // Monday of the current week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday of the current week

    const fromDateString = weekStart.toISOString().split('T')[0];
    const toDateString = weekEnd.toISOString().split('T')[0];

    const url = `https://v3.football.api-sports.io/fixtures?league=${MEXICAN_LEAGUE}&season=${SEASON_MEXICAN_LEAGUE}&from=${fromDateString}&to=${toDateString}`;
    const response = await axios.get(url, {
      headers: { 'x-apisports-key': apiKey, 'x-apisports-host': apiHost },
    });

    const fixtures = response.data.response; // Access the response fixtures

    for (const fixture of fixtures) {

      //debug
      const fixtureStatus = fixture.fixture.status.short;
      console.log('Fixture status:', fixtureStatus);

      const homeTeam = fixture.teams.home.name;
      const awayTeam = fixture.teams.away.name;
      const winner = fixture.fixture.status.short === 'FT' ? (fixture.teams.home.winner ? 'home' : fixture.teams.away.winner ? 'away' : 'tie') : null;
      const startTime = new Date(fixture.fixture.date);

      //query to find by fixture ID
      let game = await Game.findOne({ fixtureId: fixture.fixture.id });

      if (game) {
        game.result = winner;
      } else {
        game = new Game({
          fixtureId: fixture.fixture.id,
          homeTeam,
          awayTeam,
          startTime,
          result: winner
        });
      }

      await game.save();  
    }
    res.status(200).json({ message: 'Games populated successfully', games: fixtures });
  } catch (error) {
    console.error('Error updating games:', error);
    res.status(500).json({ message: 'Error populating games' });
  }
}

/**
 * To update game result in case it is required.
 * 
 * @param req.game
 * @param res.game
 */
export const updateGameResultManually = async (req, res) => {
  try {
    const game = req.game; // Get the game object from the middleware
    const { result } = req.body; // Get the result from the request body

    if (result && ['home', 'away', 'tie'].includes(result)) {
      game.result = result;
      await game.save();
      res.status(200).json({ message: 'Game result manual update successfull', game });
    } else {
      res.status(400).json({ message: 'Invalid result value' });
    }
  } catch (error) {
    console.error('Error updating game result manually:', error);
    res.status(500).json({ message: 'Error updating game result manually' });
  }
}

/**
 * Update games in our database with cron. 
 * cron function will make this method run every week, monday 12:00 AM
 */
export const updateGames = async () => {
  try {

    //Date calculation logic for constructing URL
    const currentDateTimestamp = Date.now();
    const fromDate = new Date(currentDateTimestamp);
    const toDate = new Date(currentDateTimestamp);
    //to calculate + 7 days after cron runs.
    toDate.setDate(fromDate.getDate() + 7);

    const fromDateString = fromDate.toISOString().split('T')[0];
    const toDateString = toDate.toISOString().split('T')[0];

    const url = `https://v3.football.api-sports.io/fixtures?league=${MEXICAN_LEAGUE}&season=${SEASON_MEXICAN_LEAGUE}&from=${fromDateString}&to=${toDateString}`;
    const response = await axios.get(url, { headers: { 'x-apisports-key': apiKey, 'x-apisports-host': apiHost } });

    const fixtures = response.data.response; // Access the response fixtures

    for (const fixture of fixtures) {
      const homeTeam = fixture.teams.home.name;
      const awayTeam = fixture.teams.away.name;
      const winner = fixture.fixture.status.short === 'FT' ? (fixture.teams.home.winner ? 'home' : fixture.teams.away.winner ? 'away' : 'tie') : null;
      const startTime = new Date(fixture.fixture.date);

      //query to find by fixture ID
      let game = await Game.findOne({ fixtureId: fixture.fixture.id });

      if (game) {
        game.result = winner;
      } else {
        game = new Game({
          fixtureId: fixture.fixture.id,
          homeTeam,
          awayTeam,
          startTime,
          result: winner
        });
      }

      await game.save();
    }
  } catch (error) {
    console.error('Error updating games:', error);
  }
};

//do API CALL every week 
cron.schedule('0 0 * * 1', updateGames);



export const updateGameWinnerDaily = async () => {
  try {
    // Create Date calculation logic for constructing URL
    const currentDateTimestamp = Date.now();
    const fromDate = new Date(currentDateTimestamp);
    const toDate = new Date(currentDateTimestamp);

    const fromDateString = fromDate.toISOString().split('T')[0];
    const toDateString = toDate.toISOString().split('T')[0];

    const url = `https://v3.football.api-sports.io/fixtures?league=${MEXICAN_LEAGUE}&season=${SEASON_MEXICAN_LEAGUE}&from=${fromDateString}&to=${toDateString}`;
    const response = await axios.get(url, { headers: { 'x-apisports-key': apiKey, 'x-apisports-host': apiHost } });

    const fixtures = response.data.response; // Access the response fixtures

    for (const fixture of fixtures) {
      const homeTeam = fixture.teams.home.name;
      const awayTeam = fixture.teams.away.name;
      const winner = fixture.fixture.status.short === 'FT' ? (fixture.teams.home.winner ? 'home' : fixture.teams.away.winner ? 'away' : 'tie') : null;
      const startTime = new Date(fixture.fixture.date);

      let game = await Game.findOne({ fixtureId: fixture.fixture.id });

      if (game) {
        game.result = winner;
      } else {
        game = new Game({
          fixtureId: fixture.fixture.id,
          homeTeam,
          awayTeam,
          startTime,
          result: winner,
        });
      }

      await game.save();

      // Call the calculateGuessPoints function after updating the game winners
      await calculateGuessPoints();
    }
  } catch (error) {
    console.error('Error updating game winners:', error);
  }
};

//cron job to run updateGameWinnerDaily every day at 00:00 (midnight)
cron.schedule('0 0 * * *', updateGameWinnerDaily);


// Delete a game
export const deleteGame = async (req, res) => {
  try {
    const { id } = req.game;
    //TODO - MISSING logic to not allow deleting a game that is already attached to a user guess or any other related relationships.

    const game = await Game.findOneAndDelete({_id: id});
    res.status(200).json({ deletedGame: game });
  } catch (error) {
    res.status(400).json({ error });
  }
};
