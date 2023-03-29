import express from 'express';
import {createUserLeague, getAllUserLeagues, getUserLeagueById, updateUserLeague, deleteUserLeague} from '../controllers/userLeagueController.js';

const userLeagueRouter = express.Router();

userLeagueRouter.post('/user-league', createUserLeague);
userLeagueRouter.get('/user-leagues', getAllUserLeagues);
userLeagueRouter.get('/user-league/:id', getUserLeagueById);
userLeagueRouter.put('/user-league/:id', updateUserLeague);
userLeagueRouter.delete('/user-league/:id', deleteUserLeague);

export default userLeagueRouter;