const Note = require('../models/NoteModel');

const createnote = async (req,res) => {
    const { title, body, tags, board_id, user_username, anon } = req.body

    try {
        const note = await Note.createnote( title, body, tags, board_id, user_username, anon);
        res.status(201).json( { message: "Note added", note : note._id})
    } catch (error){
        res.status(400).json( { error : error.message } )
    }
}

const getnotes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;

    try {
        const notes = await Note.getnotes( page, limit );
        res.status(201).json( {notes} )
    } catch (error){
        res.status(400).json( { error: error.message })
    }
}

const getApprovedNotes = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try {
        const notes = await Note.getApproved( page, limit );
        res.status(201).json( {notes} )
    } catch (error){
        res.status(400).json( { error: error.message })
    }
}

const getUserNote = async (req, res) => {
    const username = req.params.username
    try{
        const notes = await Note.getUserNote( username );
        
        if (!notes || notes.length == 0){
            res.status(200).json({message: "No note yet"});
        }

        res.status(200).json({notes});
    } catch ( error ){
        res.status(400).json( {error : error.message});
    }
}

const getNotesByBoard = async (req, res) => {
    const _id = req.params.id;

    try{
        const notes = await Note.notesbyboard( _id )
        res.status(200).json( { notes })
    } catch (error){
        res.status(400).json( {error: error.message} )
    }
}

const updatenote = async (req, res) => {
    const _id = req.params.id
    const { title, body, tags, user_username } = req.body

    try{
        const note = await Note.updatenote(_id, title, body, tags, user_username);
        res.status(200).json({message : "note updated", note: note})
    } catch (error){
        res.status(400).json({ error : error.message })
    }

}

const deleteNote = async (req, res) => {
    const _id  = req.params.id

    try{
        const note = await Note.deletenote( _id );
        if (!note){
            res.status(404).json( {message : "Note ID not found"})
        }
        res.status(200).json( { message: "Note deleted (literaly)", note : note} );
    } catch (error){
        res.status(400).json( { error: error.message } );
    }
}

const archiveNote = async (req, res) => {
    const _id = req.params.id;

    try{
        const note = await Note.archiveNote( _id );
        if (!note){
            res.status(404).json( {message : "Note ID not found"})
        }
        res.status(200).json({ message: "Note archieved",  note : note});
    } catch (error){
        res.status(400).json({ error : error.message})
    }
}

const archiveNoteByUser = async (req, res) => {
    const note_id = req.query.note_id;
    const username = req.query.username;

    try{
        const note = await Note.archiveNoteByUser( note_id, username);
        res.status(200).json("Note deleted");
    } catch (error){
        res.status(400).json({ error: error.message });
    }
}

const approveNote = async (req, res) => {
    const _id = req.params.id;
    
    try{
        const note = await Note.approveNote( _id );
        if (!note){
            res.status(404).json( {message : "Note ID not found"})
        }
        res.status(200).json({ message: "Note Approved!", note : note});
    } catch (error){
        res.status(400).json({ error : error.message})
    }
}

module.exports = {
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
}