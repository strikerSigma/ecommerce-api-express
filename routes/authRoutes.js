const express = require('express');
const { 
    createUser, loginUserCtrl, getAllUsers,getUser, deleteUser, updateUser,
     blockUser, unBlockUser, handleRefreshToken, logoutUser, updatePassword, resetPassword }
     = require('../controllers/userCtrl');
const {authMiddleware,isAdmin} = require('../middleware/authMiddleware');
const appRouter = express.Router();

appRouter.post('/register', createUser);
appRouter.post('/login', loginUserCtrl);
appRouter.get('/logout',authMiddleware, logoutUser);
appRouter.post('/password',updatePassword);
appRouter.post('/password-reset',resetPassword);
appRouter.get('/all-users',getAllUsers)
appRouter.get('/:id',authMiddleware,isAdmin,getUser)
appRouter.delete('/:id',deleteUser)
appRouter.put('/:id',authMiddleware,updateUser)
appRouter.get('/block-user/:id',authMiddleware,isAdmin,blockUser)
appRouter.get('/unblock-user/:id',authMiddleware,isAdmin,unBlockUser)
appRouter.get('/refresh',handleRefreshToken)
module.exports = appRouter;