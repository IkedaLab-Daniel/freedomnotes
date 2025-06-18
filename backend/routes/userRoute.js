
const express = require('express');

// > controllers 
const {
    loginUser,
    signupUser,
    getUsers
} = require('../controllers/userController')

// > Auth
const { requireAuth, requireAdmin } = require('../middlewares/requireAuth');

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// ? get all users
router.get('/all', requireAuth, requireAdmin, getUsers)


module.exports = router