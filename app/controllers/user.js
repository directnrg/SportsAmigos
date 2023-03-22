import User from '../models/user.js';

// Getting all users
const getAllUsers = async (req, res) => {
  console.log("inside getAllUsers")
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Getting One user by mongodb id
const showUserById = (req, res) => {
  res.json(res.user);
}


const showUserByUserName = (req,res) => {
  res.json(res.user)
}

// Creating one user
const addUser = async (req, res) => {
  const {
    fullName,
    email,
    password,
    phone,
    avatar,
    date,
    funds,
    leagues,
    wallet,
    paymentMethods,
  } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  try {
    const user = new User({
      fullName,
      email,
      password,
      phone,
      avatar,
      date,
      funds,
      leagues,
      wallet,
      paymentMethods,
    });
    const newUser = await user.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Error creating user', error });
    }
  }
};

// Updating One user
const updateUserById = async (req, res) => {
  const {
    fullName,
    email,
    password,
    avatar,
    date,
    funds,
    leagues,
    wallet,
    paymentMethods,
  } = req.body;

  if (fullName !== null) {
    res.user.fullName = fullName;
  }
  if (email !== null) {
    res.user.email = email;
  }
  if (password !== null) {
    res.user.password = password;
  }
  if (avatar !== null) {
    res.user.avatar = avatar;
  }
  if (date !== null) {
    res.user.date = date;
  }
  if (funds !== null) {
    res.user.funds = funds;
  }
  if (leagues !== null) {
    res.user.leagues = leagues;
  }
  if (wallet !== null) {
    res.user.wallet = wallet;
  }
  if (paymentMethods !== null) {
    res.user.paymentMethods = paymentMethods;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
    console.log("Updated User", updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Deleting One user
const deleteUserById = async (req, res) => {
  try {
    await User.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: 'User Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


export { getAllUsers, showUserById, showUserByUserName, addUser, updateUserById, deleteUserById }
