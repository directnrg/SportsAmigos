import { Router } from 'express'
import { getAllUsers, showUserByUserName, showUserById, addUser, updateUserById, deleteUserById, addNewUser } from '../controllers/user.js'
import { getUser, getByUserName } from '../middleware/user.js'

const userRouter = Router()

userRouter.get('/users', getAllUsers);
//user Name property
userRouter.get('/user/uname/:username', getByUserName, showUserByUserName)

//base path for user CRUD
//mongodb id
userRouter.route('/user/:id')
.get(getUser, showUserById)
.post(addUser)
.patch(getUser, updateUserById)
.delete(deleteUserById)


userRouter.route('/user').post(addNewUser);

export {userRouter};
