import { Router } from 'express'
import { getAllUsers, showUserByUserName, showUserById, addUser, updateUserById, deleteUserById } from '../controllers/user.js'
import { getUser, getByUserName } from '../middleware/user.js'

const userRouter = Router()

userRouter.get('/users', getAllUsers);
//user Name property

userRouter.get('/user/uname/:username', getByUserName, showUserByUserName)

userRouter.post('/user', addUser)
//base path for user RUD
//mongodb id
userRouter.route('/user/:id')
.get(getUser, showUserById)
.patch(getUser, updateUserById)
.delete(deleteUserById)

export {userRouter};
