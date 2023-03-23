import Wallet from "../models/wallet.js"

// Get all wallets
export const getWallets = async (req, res) => {
    try {
        const wallets = await Wallet.find();
        res.status(200).json({ wallets });
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Get a single wallet by id
export const getWalletById = async (req, res) => {
    try {
        const wallet = await Wallet.findById(req.params.id);
        res.status(200).json({ wallet });
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Create a new wallet
export const createWallet = async (req, res) => {
    const { user, funds, transactions } = req.body;

    try {
        const wallet = new Wallet({ user, funds, transactions });
        const savedWallet = await wallet.save();
        res.status(201).json({ savedWallet });
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Update a wallet by id
export const updateWallet = async (req, res) => {
    const { user, funds, transactions } = req.body;

    if (user !== null) {
        res.wallet.user = user;
    }
    if (funds !== null) {
        res.wallet.funds = funds;
    }
    if (transactions !== null) {
        res.wallet.transactions = transactions;
    }

    try {
        const updatedWallet = await res.wallet.save();
        res.status(200).json({ updatedWallet });
    } catch (error) {
        res.status(400).json({ error });
    }
};

// Delete a wallet
export const deleteWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findByIdAndDelete(req.params.id);
        res.status(200).json({ wallet });
    } catch (error) {
        res.status(400).json({ error });
    }
};