const Note = require('../models/NoteModel');

const createnote = async (req,res) => {
    const { title, body, tags, user_id } = req.body
    try {
        const note = await Note.createnote( title, body, tags, user_id);
        res.status(201).json( { message: "Note added"})
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

module.exports = {
    createnote,
    getnotes
}