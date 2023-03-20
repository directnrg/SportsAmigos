import User from '../models/user.js';

//middleware function to get the user by mongo id
const getUser = async (req, res, next) => {
  let user;
  console.log("req.params in getUser", req.params)
  try {
    user = await User.findById(req.params.id);
    console.log("user inside getUser", user)
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find a match for a user' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.user = user;
  next();
}

const getByUserName = async (req, res, next) => {
  try {
    console.log(req.params)
    const userName = req.params.username;
    const query = User.where({ username: userName })
    const user = await query.findOne();
    if (user == null) {
      return res.status(404).json({ message: 'Cannot find a match for that user name' });
    }
    res.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

}

export { getUser, getByUserName }
