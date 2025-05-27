const express = require('express')
router = express.Router()

// > controllers
const {
    createnote,
} = require('../controllers/noteController')

// ? Create new note
router.post('/', createnote)

module.exports = router