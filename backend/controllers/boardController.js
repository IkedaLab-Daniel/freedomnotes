const Board = require('../models/BoardModel');

const createBoard = async (req, res) => {
    const { board_title } = req.body;

    try{
        const board = await Board.createBoard( board_title );
        res.status(201).json( { message : "Board created!", board : board })
    } catch (error){
        res.status(400).json( { error : error.message } )
    }
}

module.exports = {
    createBoard,
}