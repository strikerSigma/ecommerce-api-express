const express = require('express');
const { createUser, loginUserCtrl, getAllUsers,getUser, deleteUser, updateUser } = require('../controllers/userCtrl');
const appRouter = express.Router();

appRouter.post('/register', createUser);
appRouter.post('/login', loginUserCtrl);
appRouter.get('/all-users',getAllUsers)
appRouter.get('/:id',getUser)
appRouter.delete('/:id',deleteUser)
appRouter.put('/:id',updateUser)
module.exports = appRouter;