const mongoose = require('mongoose');
const { Schema } = mongoose
const Board = require('./BoardModel');

const noteSchema = new Schema({
    title: String,
    body: String,
    tags: [String],
    user_id: String,
    board_id: String,
    status: String
}, { timestamps: true })

// ? Static for creating note
noteSchema.statics.createnote = async function ( title, body, tags, board_id, user_id ) {
    if (!title || !body || !user_id){
        throw Error("Required field/s not empty")
    }
    exist = await this.findOne( {title: title } )
    if (exist){
        throw Error('This title already exist:', title)
    }
    const note = await this.create( {title: title, body : body, tags : tags, board_id, user_id, status : "pending"} )
    // ? Add the note's ID to its Board
    await Board.findByIdAndUpdate(
        board_id,
        { $push: { notes: note._id.toString()}},
        { new: true }
    )
    return note
}

// ? static for getting *ALL notes
// * Pagination added !!!!!!!!!
noteSchema.statics.getnotes = async function ( page = 1, limit = 1000 ){
    const skip = (page - 1) * limit;

    const notes = await this.find({})
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit)
    
    const total = await this.countDocuments({});
    const totalPages = Math.ceil( total / limit );

    if (!notes){
        throw Error ('No notes found')
    }

    return {
        currentPage : page,
        totalPages,
        totalNotes: total,
        notes
    }
}

// ? static for getting all APPROVED notes
noteSchema.statics.getApproved = async function ( page = 1, limit = 10 ){
    const skip = (page - 1) * limit;

    const notes = await this.find({ status : "approved"})
        .sort({ createdAt: -1})
        .skip(skip)
        .limit(limit)
    
    const total = await this.countDocuments({ status : "approved"});
    const totalPages = Math.ceil( total / limit );

    if (!notes){
        throw Error ('No notes found')
    }

    return {
        currentPage : page,
        totalPages,
        totalNotes: total,
        notes
    }
}

// ? static to update a note
noteSchema.statics.updatenote = async function ( _id, title, body, tags, user_id ) {
    if (!title || !body || !tags || !user_id){
        throw Error ('Title field empty');
    }

    // TODO : Check if the NEW TITLE is already taken

    const note = this.findOneAndUpdate(
        { _id : _id,},
        { title: title, body : body, tags : tags, user_id : user_id }
    )
    return note
}

// ? static for deleting a note
noteSchema.statics.deletenote = async function ( _id ) {
    if (!_id){
        throw Error("Note's ID required");
    }
    
    const note = await this.findOneAndDelete({_id: _id});

    if (!note){
        throw Error("Note does not exists")
    }

    // ? Remove the note's ID on the Board's Notes Array
    if (note.board_id) {
        try{
            await Board.findByIdAndUpdate(
                note.board_id,
                { $pull: { notes: note._id.toString() } }
            );
            console.log("Note",note.board_id, "has been removed to its board as well")
        } catch (error){
            console.log( {delBoardErr : error.message});
        }
    } else {
        console.log('note.board_id is empty')
    }

    return note;
}

// ? static for archiving a note
noteSchema.statics.archiveNote = async function ( note_id ){
    if (!note_id){
        throw Error("No Note's ID on payload")
    }
    
    const note = await this.findOneAndUpdate( { _id : note_id }, { status: "archived"} )

    if (!note){
        throw Error("Note does not exist")
    }

    // ? Remove the note's ID on the Board's Notes Array
    if (note.board_id || note.board_id !== null) {
        try{
            await Board.findByIdAndUpdate(
                note.board_id,
                { $pull: { notes: note._id.toString() } }
            );
            console.log("Note's board ID:", note.board_id);
        } catch (error){
            console.log( {delBoardErr : error.message});
        }
    } else {
        console.log('note.board_id is empty')
    }

    return note;
}

// ? static for approving a note
noteSchema.statics.approveNote = async function (_id) {
    if (!_id) {
        throw Error("No Note's ID on payload");
    }

    // Update the note's status to approved and get the note document
    const note = await this.findOneAndUpdate(
        { _id: _id },
        { status: "approved" },
        { new: true } // Return the updated document
    );

    if (!note) {
        throw Error("Note does not exist");
    }

    // ? Add the note's ID back to the Board's notes array if not already present
    if (note.board_id) {
        try {
            await Board.findByIdAndUpdate(
                note.board_id,
                { $addToSet: { notes: note._id.toString() } } // $addToSet prevents duplicates
            );
            console.log("Note's board ID:", note.board_id, "added back to board notes");
        } catch (error) {
            console.log({ addBoardErr: error.message });
        }
    } else {
        console.log('note.board_id is empty');
    }

    return note;
}

module.exports = mongoose.model('Note', noteSchema)