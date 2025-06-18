const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        unique: true
    },
    role:{ 
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    notes: [String]
}, {timestamps : true});

// ? Static Sign Up
userSchema.statics.signup = async function (username, password){

    const exists = await this.findOne({username})

    if (exists){
        throw Error("Username already exist")
    }

    const ice = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, ice)

    const user = await this.create({ username : username, password : hashedPassword});

    return user
}

// ? Static for login
userSchema.statics.login = async function ( username , password ){

    const user = await this.findOne({ username : username }) // ? if exists, return the user object 

    if (!user){
        throw Error("Username does not exist")
    }

    const match = await bcrypt.compare(password, user.password) // ? return boolean

    if (!match){
        throw Error ("Incorrect Password");
    }

    return user
}

// ? static for getting all users
userSchema.statics.getUsers = async function (){
    const users = await this.find()
    return users
} 

module.exports = mongoose.model('User', userSchema) // ? .model('modelName', schema)
