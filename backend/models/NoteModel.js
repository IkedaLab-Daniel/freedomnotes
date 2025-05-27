const mongoose = require('mongoose');
const { Schema } = mongoose

const noteSchema = new Schema({
    title: String,
    body: String,
    tags: [],
    user_id: String
}, { timestamps: true })

// ? Statics
noteSchema.statics.createnote = async function ( title, body, tags, user_id ) {
    if (!title || !body || !user_id){
        throw Error("Required field/s not empty")
    }

    exist = await this.findOne( {title: title } )
    if (exist){
        throw Error('This title already exist:', title)
    }

    const note = await this.create( {title: title, body : body, tags : tags, user_id} )

    return note
}

noteSchema.statics.getnotes = async function (){
    const note = this.find({});
    if (!note){
        throw Error ('No notes found')
    }

    return note
}

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

module.exports = mongoose.model('Note', noteSchema)