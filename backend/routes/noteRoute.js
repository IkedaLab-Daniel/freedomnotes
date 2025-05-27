const express = require('express')
const router = express.Router()

// > controllers
const {
    createnote,
    getnotes,
    updatenote,
} = require('../controllers/noteController')

// ? Get all notes
router.get('/', getnotes);

// ? Create new note
router.post('/', createnote);

// ? Update a note
router.post('/:id', updatenote);

module.exports = router