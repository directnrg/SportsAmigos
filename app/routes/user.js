import { Router } from 'express';
import {
  getAllUsers,
  showUserByUserName,
  showUserById,
  addUser,
  updateUserById,
  deleteUserById,
  addNewUser,
  loginUser,
  registerUser,
  checkToken,
} from '../controllers/user.js';
import { getUser, getByUserName } from '../middleware/user.js';
import auth from '../middleware/auth.js';

const userRouter = Router();

userRouter.get('/users', getAllUsers);
//user Name property

userRouter.get('/user/uname/:username', getByUserName, showUserByUserName);

//userRouter.post('/user', addUser)
//base path for user RUD
//mongodb id
userRouter
  .route('/user/:id')
  .get(getUser, showUserById)
  .patch(getUser, updateUserById)
  .delete(deleteUserById);

userRouter.route('/user').post(addUser);
userRouter.get('/check-token', auth, checkToken);
userRouter.route('/auth').post(loginUser);
userRouter.route('/register').post(registerUser);

export default userRouter;
