const express = require('express');
const router = express.Router();

// > controllers
const {
    createBoard,
    changeBoardStatus,
    getBoards,
} = require('../controllers/boardController');

// > middlewares
const { requireAuth, requireAdmin } = require('../middlewares/requireAuth');

// > endpoints
// ? Create new board
router.post('/', requireAuth, requireAdmin, createBoard);

// ? Update board status
router.patch('/:id', requireAuth, requireAdmin, changeBoardStatus);

// ? Get all boards
router.get('/', getBoards);

module.exports = router