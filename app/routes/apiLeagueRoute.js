import { fecthMexicanLeagues } from "../controllers/apiLeagueController.js";
import express from 'express';

const apiLeagueRouter = express.Router();

apiLeagueRouter.get("/mexican-leagues-current",fecthMexicanLeagues);

export default apiLeagueRouter;