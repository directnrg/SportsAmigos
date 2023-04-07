import Game from '../models/game.js';
import axios from 'axios';
import dotenv from 'dotenv';
import cron from 'node-cron';

//config environment variables
dotenv.config()


/*TODO - I consider this is not needed anymore since the create 
should better happen when the API is called to get data*/
// // Create a new game
// export const createGame = async (req, res) => {
//   try {
//     const game = new Game(req.body);
//     await game.save();
//     res.status(201).json({ game });
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// };

// Get all games
export const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ games });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Update a game
export const updateGames = async () => {
  try {
    //create Date calculation logic for constructing URL

    const apiKey = process.env.API_SPORTS; 
    const apiHost = process.env.API_SPORTS_HOST;
    //const url = `https://v3.football.api-sports.io/fixtures?league=262&season=2022&from=${}&to=${}`;
    const response = await axios.get(url, { headers: { 'x-apisports-key': apiKey, 'x-apisports-host' : apiHost } });

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



export const updateGameWinner = async() => {
  //we need a cron to update winner daily
}

//have cron here for update game winner

// Delete a game
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    res.status(200).json({ game });
  } catch (error) {
    res.status(400).json({ error });
  }
};
