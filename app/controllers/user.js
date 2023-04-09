import User from '../models/user.js';
import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';

dotenv.config();
const jwtSecret = process.env.JWTSECRET;
import { check, validationResult } from 'express-validator';

// Getting all users
const getAllUsers = async (req, res) => {
  console.log('inside getAllUsers');
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
};

const showUserByUserName = (req, res) => {
  res.json(res.user);
};

//Check Token
const checkToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

//Login the user
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    //See if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    //Return jsonwebtoken
    const payload = {
      //get the payload
      user: {
        id: user.id, //mongoose abstraction _id
      },
    };

    jwt.sign(
      //sign the token
      payload, //pass the payload
      jwtSecret, //pass the secret
      //config.get('jwtSecret'), //pass the secret
      { expiresIn: 360000 }, //token expiration
      (error, token) => {
        //call back - error or token
        if (error) throw error;
        res.json({ token });
      }
    );
    //res.send('User registered');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

//@desc     Register user with jwt
//@access   Public
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, password } = req.body;
  try {
    //See if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
    }
    //Get users gravatar
    const avatar = gravatar.url({
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    user = new User({
      fullName,
      email,
      password,
      avatar,
    });

    //Encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const jwtSecret = process.env.JWTSECRET;
    await user.save(); //save the user in DB

    //Return jsonwebtoken
    const payload = {
      //get the payload
      user: {
        id: user.id, //mongoose abstraction _id
      },
    };

    jwt.sign(
      //sign the token
      payload, //pass the payload
      jwtSecret, //pass the secret
      // config.get('jwtSecret'), //pass the secret
      { expiresIn: 360000 }, //token expiration
      (error, token) => {
        //call back - error or token
        if (error) throw error;
        res.json({ token });
      }
    );
    //res.send('User registered');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

// Creating one user
const addUser = async (req, res) => {
  const { fullName, email, password, phone, avatar, date, leagues } = req.body;

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
      leagues,
    });
    const newUser = await user.save();
    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Error creating user', error });
    }
  }
};

//Add a new user
const addNewUser = async (req, res) => {
  console.log('Entered /user (post)', req.body);
  if (!req.body.fullName || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Required fields are missing' });
  } else {
    try {
      const newUser = new User({ ...req.body });
      console.log('New user: ', newUser);
      const response = await newUser.save();
      res
        .status(201)
        .json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.log(error.message);
      if (error.code === 11000) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: error.message });
      }
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
    phone,
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
  if (phone !== null) {
    res.user.phone = phone;
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
    console.log('Updated User', updatedUser);
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
};

export {
  getAllUsers,
  showUserById,
  showUserByUserName,
  addUser,
  updateUserById,
  deleteUserById,
  addNewUser,
  loginUser,
  registerUser,
  checkToken,
};
