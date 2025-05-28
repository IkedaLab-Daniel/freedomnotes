const express = require('express');
const router = express.Router();

// > controllers
const {
    createnote,
    getnotes,
    updatenote,
} = require('../controllers/noteController');

// > middlewares
const requireAuth = require('../middlewares/requireAuth');

// ? Get all notes
router.get('/', getnotes);

// ? Create new note
router.post('/', requireAuth, createnote);

// ? Update a note
router.patch('/:id', requireAuth, updatenote);

module.exports = router