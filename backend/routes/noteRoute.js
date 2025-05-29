const express = require('express');
const router = express.Router();

// > controllers
const {
    createnote,
    getnotes,
    updatenote,
    deleteNote,
    archiveNote,
} = require('../controllers/noteController');

// > middlewares
const requireAuth = require('../middlewares/requireAuth');

// ? Get all notes
router.get('/', getnotes);

// ? Create new note
router.post('/', requireAuth, createnote);

// ? Delete a note
router.delete('/:id', requireAuth, deleteNote);

// ? Update a note
router.patch('/:id', requireAuth, updatenote);

// ? Archive a  note
router.patch('/:id/archive', requireAuth, archiveNote);

module.exports = router