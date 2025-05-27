
const express = require('express')

// > controllers 
const {
    loginUser,
    signupUser,
    updateUser,
} = require('../controllers/userController')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// TODO update route
router.patch('/:id', updateUser)

module.exports = router