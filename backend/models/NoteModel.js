const mongoose = require('mongoose');
const { Schema } = mongoose
const Board = require('./BoardModel');
const User = require('./UserModel')

const noteSchema = new Schema({
    title: String,
    body: String,
    tags: [String],
    user_username: String,
    anon: {
        type: Boolean,
        default: false
    },
    board_id: String,
    status: String
}, { timestamps: true })

// ? Static for creating note
noteSchema.statics.createnote = async function ( title, body, tags, board_id, user_username, anon ) {
    if (!title || !body || !user_username){
        throw Error("Required field/s not empty")
    }

    // ? Validate limit
    if (title.length >= 25){
        throw Error("Title too long")
    }
    if (body.length >= 300){
        throw Error("Message too long")
    }

    // ? Check if the board already has 20 notes
    const board = await Board.findById(board_id);
    if (!board) {
        throw Error("Board not found");
    }
    if (board.notes.length >= 20) {
        throw Error("Max note limit (20) reached for this board");
    }

    const exist = await this.findOne({ title: title });

    if (exist){
        throw Error('This title already exist: ' + title)
    }
    
    const note = await this.create({ title, body, tags, board_id, user_username, anon: anon, status: "pending" });
    
    // ? Add the note's ID to its Board
    await Board.findByIdAndUpdate(
        board_id,
        { $push: { notes: note._id.toString() }},
        { new: true }
    )

    // ? Add the note's ID to User's note key
    await User.findOneAndUpdate(
        { username: user_username },
        { $push: { notes: note._id.toString() } }
    );
    return note
}

// ? static for getting *ALL notes
// * Pagination added !!!!!!!!!
noteSchema.statics.getnotes = async function (page = 1, limit = 1000, sort = 'date-des') {
    const skip = (page - 1) * limit;

    let notes;
    const total = await this.countDocuments({});
    const totalPages = Math.ceil(total / limit);

    if (sort === 'pending') {
        // Prioritize "pending" status, then sort by createdAt descending
        notes = await this.aggregate([
            {
                $addFields: {
                    isPending: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                }
            },
            { $sort: { isPending: -1, createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
        ]);
    } else if (sort === "date-asc"){
        // ? Sort by createdAt ascending
        notes = await this.find({})
            .sort({ createdAt: 1 })
            .skip(skip)
            .limit(limit);
    } else {
        // ? Default: Sort by createdAt descending
        notes = await this.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }

    if (!notes || notes.length === 0) {
        throw Error('No notes found');
    }

    return {
        currentPage: page,
        totalPages,
        totalNotes: total,
        notes
    };
};



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

// ? Static to get note of specified user:
noteSchema.statics.getUserNote = async function ( username ){
    if (!username){
        throw Error("Detail needed not provided.")
    }

    const notes = await this.find({ user_username : username}).sort({ createdAt: -1})

    return notes;
}

// ? static to update a note
noteSchema.statics.updatenote = async function ( _id, title, body, tags, user_username ) {
    if (!title || !body || !tags || !user_username){
        throw Error ('Title field empty');
    }

    // TODO : Check if the NEW TITLE is already taken

    const note = this.findOneAndUpdate(
        { _id : _id,},
        { title: title, body : body, tags : tags, user_username : user_username }
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

// ? User archive their note
noteSchema.statics.archiveNoteByUser = async function ( note_id, username ){
    if (!note_id){
        throw Error("No Note's ID on payload")
    }
    
    const note = await this.findOneAndUpdate( { _id : note_id }, { status: "archived"} )

    if (!note){
        throw Error("Note does not exist")
    }

    // ? Check if the username matches the note's user_username
    if (note.user_username !== username) {
        throw Error("You are not authorized to archive this note");
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

// ? Static to get all notes of the specific board
noteSchema.statics.notesbyboard = async function (board_id) {
    if (!board_id) {
        throw Error("Board ID Missing");
    }

    // ? Check if the board_id actually exists
    const board = await Board.findOne({ _id: board_id });
    if (!board) {
        throw Error("Board not found!");
    }

    // ? Get number of pending notes on that board (status: "pending")
    const pendingCount = await this.countDocuments({ board_id: board_id, status: "pending" })
    // ? Get all notes with the board_id (must be approved)
    const notes = await this.find({ board_id: board_id, status: "approved" });

    return {
        boardName: board.board_name,
        pendingNotes: pendingCount,
        notes,
    };
}

module.exports = mongoose.model('Note', noteSchema)