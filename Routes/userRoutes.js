const express = require('express')
const { loginController, registerController,fetchAllUsersController } = require('../Controllers/userController')
const Router = express.Router()

const { protect } = require("../Middleware/authmiddleware");

Router.post('/login',loginController)
Router.post('/register',registerController)
Router.get('/fetchUsers',protect,fetchAllUsersController)

module.exports = Router