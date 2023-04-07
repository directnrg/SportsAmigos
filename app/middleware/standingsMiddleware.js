import Standing from "../models/standing.js";

//User league holds the standings per user per league.
export const getStandingById = async (req, res, next) => {
    let standing;
    try {
        const { id } = req.params;
        const userLeague = await Standing.findById(id).populate('user', 'fullName').populate('league', 'name');
        if (!userLeague) {
            return res.status(404).json({ message: 'User standing not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    req.stading = standing;
    next();
}

export const getStandingByLeagueId = async (req, res, next) => {
    let standings;
    try {
        const { leagueId } = req.params;
        const userLeague = await Standing.findById(leagueId).populate('user', 'fullName').populate('league', 'name');
        if (!userLeague) {
            return res.status(404).json({ message: 'User standing not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

    req.stadings = standings;
    next();
}
