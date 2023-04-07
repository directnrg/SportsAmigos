
import axios from 'axios';
import dotenv from 'dotenv';

//config environment variables
dotenv.config()

// API KEY AND HOST global
const apiKey = process.env.API_SPORTS; 
const apiHost = process.env.API_SPORTS_HOST;

export const fecthMexicanLeagues = async (req, res) => {
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/leagues',
      params: {country: 'Mexico', current: 'true'},
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost
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
        apiLeagues.push({ leagueId, leagueName, leagueLogo});
      });
  
      res.status(200).json(apiLeagues)
  
      console.log(response.data);
    }).catch((error) => {
  
      res.status(400).json({ error });
      console.error(error);
    });
  }
  