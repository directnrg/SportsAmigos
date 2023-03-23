import Wallet from "../models/wallet.js";

// Get a single wallet by id
export const getWalletByIdMiddleware = async (req, res, next) => {
    let wallet;
    try {
      wallet = await Wallet.findById(req.params.id);
      
    } catch (error) {
      res.status(400).json({ error });
    }
    req.wallet = wallet;
      next();
  };