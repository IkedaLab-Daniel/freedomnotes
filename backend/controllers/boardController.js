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

const changeBoardStatus = async (req, res) => {
    const _id = req.params.id;
    const { status } = req.body;

    try{
        const board = await Board.boardStatus( _id , status);
        res.status(200).json( { message : "Board's status has been changed!", board : board} )
    } catch (error){
        res.status(400).json( { error: error.message } )
    }

}

const getBoards = async (req, res) => {
    try {
        const boards = await Board.getAllBoards();
        const boardsWithTotal = boards.map(board => ({
            ...board.toObject(),
            totalNotes: board.notes.length
        }));
        res.status(200).json({ boards: boardsWithTotal });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createBoard,
    changeBoardStatus,
    getBoards,
}