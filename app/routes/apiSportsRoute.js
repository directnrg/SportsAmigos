import { fecthMexicanLeagues } from "../controllers/apiLeagueController.js";
import express from 'express';

const apiSportsRouter = express.Router();

//route to get current mexican leagues from sports api
apiSportsRouter.get("/mexican-leagues-current",fecthMexicanLeagues);

export default apiSportsRouter;