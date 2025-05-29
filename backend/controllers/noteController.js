const Note = require('../models/NoteModel');

const createnote = async (req,res) => {
    const { title, body, tags, board_id, user_id } = req.body
    try {
        const note = await Note.createnote( title, body, tags, board_id, user_id);
        res.status(201).json( { message: "Note added", note : note._id})
    } catch (error){
        res.status(400).json( { error : error.message } )
    }
}

const getnotes = async (req, res) => {
    try {
        const notes = await Note.getnotes();
        res.status(201).json( {notes} )
    } catch (error){
        res.status(400).json( { error: error.message })
    }
}

const updatenote = async (req, res) => {
    const _id = req.params.id
    const { title, body, tags, user_id } = req.body

    try{
        const note = await Note.updatenote(_id, title, body, tags, user_id);
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
}