const express = require('express');
const router = express.Router();

// > controllers
const {
    createnote,
    getnotes,
    updatenote,
    deleteNote,
    archiveNote,
    approveNote,
    getApprovedNotes,
    getNotesByBoard,
} = require('../controllers/noteController');

// > middlewares
const { requireAuth, requireAdmin } = require('../middlewares/requireAuth');

// ? Get all notes
router.get('/all', requireAuth, requireAdmin, getnotes);

// ? Get all approved notes
router.get('/', getApprovedNotes);

// ? Get all notes by specific board
router.get('/board/:id', getNotesByBoard);

// ? Create new note
router.post('/', requireAuth, createnote);

// ? Delete a note
router.delete('/:id', requireAuth, requireAdmin, deleteNote);

// ? Update a note
router.patch('/:id', requireAuth, updatenote);

// ? Archive a  note
router.patch('/:id/archive', requireAuth, requireAdmin, archiveNote);

// ? approveNote
router.patch('/:id/approve', requireAuth, requireAdmin, approveNote);

module.exports = router