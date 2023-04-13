import Game from '../models/game.js';
import axios from 'axios';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { calculateGuessPointsOfAllUsers } from './guessController.js';
import { torontoDateTimeFormat } from '../helpers/TorontoDateFormatter.js';

//config environment variables
dotenv.config()

// API KEY AND HOST global
const apiKey = process.env.API_SPORTS_KEY;
const apiHost = process.env.API_SPORTS_HOST;

//GLOBAL VARIABLES
//league - MEXICAN LEAGUE
const MEXICAN_LEAGUE = 262;
const SEASON_MEXICAN_LEAGUE = 2022;
const TIME_ZONE = 'America/Toronto'

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
 * Populates the games for the current week of the Mexican league from the external API.
 * It will populate games with api call without the need of cron or scheduled call.
 * If called in the same week, it will update the current games in the dabase that match the fixture id 
 * of the API.
 * Executing this update will update the result property for all the games in the current week.
 * - If the status of the game is FT (Finished Time) or completed, result will then be updated the 
 * appropiate enum of the Game Object ['home','away','tie', null]
 * - Null will be assigned to the result property of game if the status of game from the API is different to FT
 * @async
 * @function GamesOfLastWeekAPI
 * @param {Promise} res - Express response object
 * @throws 500 error if there is an error while populating games
 * @returns {JSON} JSON object containing the status of the operation and the games populated
 */

export const populateOrUpdateGamesOfLastWeekApi = async (req, res) => {

  try {
    //Data calculation to generate dates that matches the current week when the method is called.
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() - 6); // Monday of the last week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday of the last week

    const fromDateString = weekStart.toISOString().split('T')[0];
    const toDateString = weekEnd.toISOString().split('T')[0];

    const url = `https://v3.football.api-sports.io/fixtures?league=${MEXICAN_LEAGUE}&season=${SEASON_MEXICAN_LEAGUE}&from=${fromDateString}&to=${toDateString}&timezone=${TIME_ZONE}`;
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

      //if game exist then just update the game result
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
    res.status(200).json({ message: 'Games of last week populated or Updated successfully', games: fixtures });
  } catch (error) {
    console.error('Error updating games:', error);
    res.status(500).json({ message: 'Error populating games' });
  }
}

export const populateOrUpdateGamesApi = async (req, res) => {

  try {
    //Data calculation to generate dates that matches the current week when the method is called.
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -5 : 1)); // Monday of the current week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday of the current week

    const fromDateString = weekStart.toISOString().split('T')[0];
    const toDateString = weekEnd.toISOString().split('T')[0];

    const url = `https://v3.football.api-sports.io/fixtures?league=${MEXICAN_LEAGUE}&season=${SEASON_MEXICAN_LEAGUE}&from=${fromDateString}&to=${toDateString}&timezone=${TIME_ZONE}`;
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

      //if game exist then just update the game result
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
    res.status(200).json({ message: 'Games populated or Updated successfully', games: fixtures });
  } catch (error) {
    console.error('Error updating games:', error);
    res.status(500).json({ message: 'Error populating games' });
  }
}

/**
 * Update the result of a game manually.
 *
 * @async
 * @function updateGameResultManually
 * @param {Object} req - Express request object
 * @param {Object} req.game - The game object retrieved from middleware
 * @param {Object} req.body - The request body containing the updated result information
 * @param {string} req.body.result - The updated result of the game (either 'home', 'away', or 'tie')
 * @param {Promise} res - Express response object
 * @throws 400 error if the provided result value is invalid
 * @throws 500 error if there is an error updating the game result manually
 * @returns {JSON} JSON object representing the updated game
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
 * Populate games of the week from the database.
 *
 * @async
 * @function populateGamesOfTheWeek
 * @param {Object} req - Express request object
 * @param {Promise} res - Express response object
 * @throws 404 error if no games are found for the current week
 * @throws 500 error if there is an error fetching games from the database
 * @returns {JSON} JSON object representing the fetched games from the database
 */
export const populateGamesOfTheWeek = async (req, res) => {
  try {
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -5 : 1)); // Monday of the current week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday of the current week

    // Fetch games from the Game model in the database for the current week
    const games = await Game.find({
      startTime: {
        $gte: weekStart,
        $lte: weekEnd
      }
    });

    //Date formatting into Toronto time
    const gamesWithConvertedDates = games.map(game => {
      const newGame = game.toObject();
      newGame.startTime = torontoDateTimeFormat.format(new Date(game.startTime));
        return newGame;
    });

    if (!games.length) {
      return res.status(404).json({ message: 'No games found for the current week' });
    }

    res.status(200).json({ message: 'Games fetched successfully from Database', games: gamesWithConvertedDates });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games' });
  }
};


export const populateGamesOfTheLastWeek = async (req,res) => {
  try {
    //data calculation to get the games of the last week 
    const currentDate = new Date();
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay() - 6); // Monday of the current week
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // Sunday of the current week

    // Fetch games from the Game model in the database for the current week
    const games = await Game.find({
      startTime: {
        $gte: weekStart,
        $lte: weekEnd
      }
    });

     //Date formatting into Toronto time
     const gamesWithConvertedDates = games.map(game => {
      const newGame = game.toObject();
      newGame.startTime = torontoDateTimeFormat.format(new Date(game.startTime));
        return newGame;
    });

    if (!games.length) {
      return res.status(404).json({ message: 'No games found for the last week' });
    }

    res.status(200).json({ message: 'Games from the last week fetched successfully from Database', games: gamesWithConvertedDates });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games' });
  }
};


/**
 * Update games in the database with cron. This function will run every week, on Monday at 12:00 AM.
 *
 * @async
 * @function updateGames
 * @throws {Error} Throws an error if there is an issue updating games in the database.
 */
export const updateGames = async () => {
  try {

    //Date calculation logic for constructing URL considering that cron will execute this every monday
    const currentDateTimestamp = Date.now();
    const fromDate = new Date(currentDateTimestamp);
    const toDate = new Date(currentDateTimestamp);
    //to calculate + 7 days after cron runs.
    toDate.setDate(fromDate.getDate() + 7);

    const fromDateString = fromDate.toISOString().split('T')[0];
    const toDateString = toDate.toISOString().split('T')[0];

const url = `https://v3.football.api-sports.io/fixtures?league=${MEXICAN_LEAGUE}&season=${SEASON_MEXICAN_LEAGUE}&from=${fromDateString}&to=${toDateString}&timezone=${TIME_ZONE}`;
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

      // Call the calculateGuessPointsOfUsers function after updating the game winners
      await calculateGuessPointsOfAllUsers();
    }
  } catch (error) {
    console.error('Error updating games:', error);
  }
};

//do API CALL every week 
cron.schedule('0 0 * * 1', updateGames);


/**
 * Update the winners of games for the current day and calculate the points for the guesses.
 *
 * @async
 * @function updateFixtureWinnerDaily
 * @throws If there is an error updating the game winners.
 */
export const updateFixtureWinnerDaily = async () => {
  try {
    // Create Date calculation logic for constructing URL
    const currentDateTimestamp = Date.now();
    const fromDate = new Date(currentDateTimestamp);
    const toDate = new Date(currentDateTimestamp);

    const fromDateString = fromDate.toISOString().split('T')[0];
    const toDateString = toDate.toISOString().split('T')[0];

const url = `https://v3.football.api-sports.io/fixtures?league=${MEXICAN_LEAGUE}&season=${SEASON_MEXICAN_LEAGUE}&from=${fromDateString}&to=${toDateString}&timezone=${TIME_ZONE}`;
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

      // Call the calculateGuessPointsOfUsers function after updating the game winners
      await calculateGuessPointsOfAllUsers();
    }
  } catch (error) {
    console.error('Error updating game winners:', error);
  }
};

//cron job to run updateGameWinnerDaily every day at 00:00 (midnight)
cron.schedule('0 0 * * *', updateFixtureWinnerDaily);

/**
 * Delete a game from the database.
 *
 * @async
 * @function deleteGame
 * @param {Object} req - Express request object
 * @param {Object} req.game - The game object to be deleted obtained from the middleware
 * @param {string} req.game.id - The id of the game to be deleted
 * @param {Object} res - Express response object
 * @throws 400 error if there is an error deleting the game
 * @returns {JSON} JSON object representing the deleted game
 */
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
