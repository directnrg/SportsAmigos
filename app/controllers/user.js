import User from '../models/user.js';
import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import gravatar from 'gravatar';
import jwt from 'jsonwebtoken';

dotenv.config();
const jwtSecret = process.env.JWTSECRET;
import { check, validationResult } from 'express-validator';

/**
 * Fetches all users from the database.
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {JSON} - JSON object containing all users.
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
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

/**
 * for checking validity of the token. Admin purposes.
 * Controller function to get user data for the authenticated user based on the token in the request header.
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<Object>} The user object without the password field.
 * @throws {Error} Server error if there was a problem fetching the user data.
 */
const checkToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

/**
 * Logs in the user
 *
 * @async
 * @function
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {JSON} Returns JSON web token upon successful login
 */
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

/**
 * Register a new user with jwt
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {JSON} JSON object containing JWT if successful, error message if unsuccessful.
 */
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

/**
 * Add a new user
 * @param {Object} req - The request object
 * @param {Object} req.body - The user object to be added
 * @param {string} req.body.fullName - The full name of the user
 * @param {string} req.body.email - The email address of the user
 * @param {string} req.body.password - The password of the user
 * @param {string} req.body.phone - The phone number of the user (optional)
 * @param {string} req.body.avatar - The avatar image of the user (optional)
 * @param {Date} req.body.date - The of creation of user
 * @param {Array} [req.body.leagues] - The leagues the user belongs to (optional)
 * @param {Object} res - The response object
 * @returns {JSON} - The newly created user object
 * @throws {Object} - Error message and status code
 */
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

/**
 * Add a new user
 * @param {Object} req - The HTTP request object
 * @param {Object} res - The HTTP response object
 * @returns {JSON} - The JSON Object response object containing a message and user data
 */
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

/**
 * Updates a user by ID
 *
 * @async
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {JSON} - The updated user object
 * @throws Error object with message property
 */
const updateUserById = async (req, res) => {
  const {
    fullName,
    email,
    password,
    avatar,
    phone,
    date,
    leagues,
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
 
  if (leagues !== null) {
    res.user.leagues = leagues;
  }
  try {
    const updatedUser = await res.user.save();
    res.status(200).json(updatedUser);
    console.log('Updated User', updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Delete a user by ID.
 * 
 * @param {Object} req - The request object.
 * @param {Object} req.params - The parameters passed in the request.
 * @param {string} req.params.id - The ID of the user to delete.
 * @param {Object} res - The response object.
 * @returns {JSON} The response object with a message indicating that the user was deleted.
 * @throws Error If an error occurs while deleting the user.
 */
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
