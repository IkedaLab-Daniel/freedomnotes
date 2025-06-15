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
    getUserNote,
    archiveNoteByUser
} = require('../controllers/noteController');

// > middlewares
const { requireAuth, requireAdmin } = require('../middlewares/requireAuth');

// ? Get all notes
router.get('/all', requireAuth, requireAdmin, getnotes);

// ? Get all approved notes
router.get('/', getApprovedNotes);

// ? Get notes of specific user
router.get('/user/:username', requireAuth, getUserNote);

// ? Get all notes by specific board
router.get('/board/:id', getNotesByBoard);

// ? Create new note
router.post('/', requireAuth, createnote);

// ? Delete a note
router.delete('/:id', requireAuth, requireAdmin, deleteNote);

// ? Route to archive note by user (using query parameters)
router.patch('/archive-by-user', requireAuth, archiveNoteByUser);

// ? Update a note
// ! since thiis is :id, change for to more specific like "update-note/:id"
router.patch('/:id', requireAuth, updatenote);

// ? Archive a  note
router.patch('/:id/archive', requireAuth, requireAdmin, archiveNote);

// ? approveNote
router.patch('/:id/approve', requireAuth, requireAdmin, approveNote);

module.exports = router