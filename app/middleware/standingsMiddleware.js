import Standing from "../models/standing.js";

// User league holds the standings per user per league.
export const findStandingById = async (req, res, next) => {
    let standing;
    try {
      const { id } = req.params;
      standing = await Standing.findById(id)
        .populate('league', 'name')
        .populate('standings.user', 'fullName');
      if (!standing) {
        return res.status(404).json({ message: 'Standing not found' });
      }
      req.standing = standing;
      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


