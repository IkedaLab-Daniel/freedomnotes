const express = require('express');
const router = express.Router();

// > controllers
const {
    createBoard,
} = require('../controllers/boardController');
const requireAuth = require('../middlewares/requireAuth');

router.post('/', requireAuth, createBoard);

module.exports = router