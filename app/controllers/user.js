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
    dateOfBirth,
    email,
    avatar,
    phone,
    address,
    username,
    password,
    preferredCurrency,
    bettingPreferences,
    paymentInformation,
    termsAndConditions,
  } = req.body;

  if (!fullName || !dateOfBirth || !email || !phone || !username || !password || !preferredCurrency || !termsAndConditions) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  const user = new User({
    fullName,
    dateOfBirth,
    email,
    avatar,
    phone,
    address,
    username,
    password,
    preferredCurrency,
    bettingPreferences,
    paymentInformation,
    termsAndConditions,
  });

  try {
    const newUser = await user.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Username or email already exists' });
    } else {
      res.status(500).json({ message: 'Error creating user', error });
    }
  }
};


//Add a new user
const addNewUser = async (req,res)=>{
  console.log('Entered /user (post)', req.body)
  if (!req.body.fullName  || !req.body.email   || !req.body.password ) {
    return res.status(400).json({ message: 'Required fields are missing' });
  } else {
    try{
      const newUser = new User({...req.body})
      console.log('New user: ',newUser)
      const response = await newUser.save();
      res.status(201).json({ message: 'User created successfully', user: newUser });

    }

    catch (error)
    {
      //console.log(error.message)
      if (error.code === 11000) {
        res.status(400).json({ message:error.message});
      } else {
        res.status(500).json({ message: error.message });
      }

    }
  }
 
}





// Updating One user
const updateUserById = async (req, res) => {
  const {
    fullName,
    dateOfBirth,
    email,
    avatar,
    phone,
    address,
    username,
    password,
    preferredCurrency,
    bettingPreferences,
    paymentInformation,
    termsAndConditions,
  } = req.body;

  if (fullName !== null) {
    res.user.fullName = fullName;
  }
  if (dateOfBirth !== null) {
    res.user.dateOfBirth = dateOfBirth;
  }
  if (email !== null) {
    res.user.email = email;
  }
  if (avatar !== null) {
    res.user.avatar = avatar;
  }
  if (phone !== null) {
    res.user.phone = phone;
  }
  if (address !== null) {
    res.user.address = address;
  }
  if (username !== null) {
    res.user.username = username;
  }
  if (password !== null) {
    res.user.password = password;
  }
  if (preferredCurrency !== null) {
    res.user.preferredCurrency = preferredCurrency;
  }
  if (bettingPreferences !== null) {
    res.user.bettingPreferences = bettingPreferences;
  }
  if (paymentInformation !== null) {
    res.user.paymentInformation = paymentInformation;
  }
  if (termsAndConditions !== null) {
    res.user.termsAndConditions = termsAndConditions;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
    console.log("Updated User",updatedUser)
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


export { getAllUsers, showUserById, showUserByUserName, addUser, updateUserById, deleteUserById, addNewUser}
