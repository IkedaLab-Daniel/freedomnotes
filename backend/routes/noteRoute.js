const express = require('express')
const router = express.Router()

// > controllers
const {
    createnote,
    getnotes,
} = require('../controllers/noteController')

// ? Get all notes
router.get('/', getnotes);

// ? Create new note
router.post('/', createnote);

module.exports = router