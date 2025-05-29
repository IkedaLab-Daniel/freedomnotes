const mongoose = require('mongoose');
const { Schema } = mongoose;

const boardSchema = new Schema({
    board_name: String,
    notes : [String],
    closeDate: {
        type: Date,
    },
    status: String
}, { timestamps : true })

// ? statics for creating new board
boardSchema.statics.createBoard = async function ( board_name ){
    
    if (!board_name){
        throw Error('Board Name required!')
    }

    const board = this.create( { board_name : board_name, closeDate : "", status : "open"})

    return board;
}


// ? statics for changing board's status
boardSchema.statics.boardStatus = async function ( _id, status ){
    if (!status || !_id){
        throw Error("Must fil all fields required");
    }

    if (status !== "open" && status !== "close"){
        throw Error("Status value bad")
    }

    const board = await this.findOneAndUpdate({ _id: _id }, { status: status });

    return board;
}

module.exports = mongoose.model('Board', boardSchema);

