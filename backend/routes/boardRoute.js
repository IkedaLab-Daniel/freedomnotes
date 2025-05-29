const express = require('express');
const router = express.Router();

// > controllers
const {
    createBoard,
    changeBoardStatus,
} = require('../controllers/boardController');

// > middlewares
const requireAuth = require('../middlewares/requireAuth');

// > endpoints
// ? Create new board
router.post('/', requireAuth, createBoard);

// ? Update board status
router.patch('/:id', requireAuth, changeBoardStatus);

module.exports = router