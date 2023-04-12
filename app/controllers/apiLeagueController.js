
import axios from 'axios';
import dotenv from 'dotenv';

//config environment variables
dotenv.config()

// API KEY AND HOST global
const apiKey = process.env.API_SPORTS_KEY; 
const apiHost = process.env.API_SPORTS_HOST;

//league - MEXICAN LEAGUE
const MEXICAN_LEAGUE = 262;

//fetch current mexican leagues we migth not need it.
export const fecthMexicanLeagues = async (req, res) => {
    const options = {
      method: 'GET',
      url: 'https://v3.football.api-sports.io/leagues',
      params: {country: 'Mexico', id:MEXICAN_LEAGUE, current: 'true'},
      headers: {
        'Content-Type': 'application/json',
        'x-apisports-key': apiKey,
        'x-apisports-host': apiHost
      }
    };
    
    axios.request(options).then((response) => {
      const leagues = response.data.response;
  
      //to store leagues with id, logo and name
      const apiLeagues = []
  
      leagues.forEach((league) => {
        const leagueId = league.league.id;
        const leagueName = league.league.name;
        const leagueLogo = league.league.logo;
        const endDate = league.seasons[0].end;
        apiLeagues.push({ leagueId, leagueName, leagueLogo, endDate});
      });
  
      res.status(200).json({mexicanLeagues: apiLeagues})
  
      //complete response
      console.log(leagues);
    }).catch((error) => {
  
      res.status(400).json({ error });
      console.error(error);
    });
  }
  