import express from 'express';
import {
    createWallet,
    getWallets,
    getWalletById,
    updateWallet,
    deleteWallet,
} from './WalletController.js';

const walletRouter = express.Router();

// Create a new wallet
walletRouter.post('/wallet', createWallet);

// Get all wallets
walletRouter.get('/wallets', getWallets);

// Get a single wallet by id
walletRouter.get('/:id', getWalletById);

// Update a wallet
walletRouter.patch('/wallet/:id', updateWallet);

// Delete a wallet
walletRouter.delete('/wallet/:id', deleteWallet);

export default walletRouter;