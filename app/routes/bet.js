//TODO not implemented. all methods still not exist but can be reffered as template.
import { Router } from 'express'
import { getAllbets, betByBetName, betById, addBet, updateBetById, deleteBetById } from '../controllers/bet.js'
import { getBet, getBetByBetName } from '../middleware/bet.js'

const betRouter = Router()

betRouter.get('/bets', getAllbets);
//bet Name property
betRouter.get('/bet/:betname', getBetByBetName, betByBetName)

//base path for bet CRUD
//mongodb id
betRouter.route('bet/:id')
.get(getBet, betById)
.post(addBet)
.patch(getBet, updateBetById)
.delete(deleteBetById)

export {betRouter};
