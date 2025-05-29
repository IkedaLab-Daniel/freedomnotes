const mongoose = require('mongoose');
const { Schema } = mongoose;

const boardSchema = new Schema({
    board_name: String,
    notes : [String],
    closeDate : new Date()
}, { timestamps : true })

// ? statics for creating new board
boardSchema.statics.createBoard = async function ( board_name ){
    
    if (!board_name){
        throw Error('Board Name required!')
    }

    const board = this.create( { board_name : board_name})

    return board;
}

module.exports = mongoose.model('Board', boardSchema);

