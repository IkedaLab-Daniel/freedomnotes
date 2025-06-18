const User = require('../models/UserModel')
const jwt = require('jsonwebtoken');

const signToken = ({ _id, role }) => {
    const token = jwt.sign({_id, role}, process.env.SECRET, { expiresIn : '1d'})
    return token
}

const loginUser = async (req, res) => {
    const { username , password } = req.body

    try {
        const user = await User.login( username , password);
        const token = signToken({ _id: user._id, role: user.role });
        res.status(200).json( { 
            username: user.username,
            token : token,
            role : user.role
        } );
        console.log('A user successfully logged in:', user.username);
        console.log('Token:', token);
    } catch (error) {
        res.status(400).json( { error: error.message })
    }

}

const signupUser = async (req, res) => {
    const { username , password } = req.body
    try{
        const user = await User.signup(username, password);
        const token = signToken(user._id);
        res.status(200).json( { 
            username: user.username,
            token : token,
            role : user.role
        } );    } catch (error){
        res.status(400).json({ error: error.message})
    }
} 

const getUsers = async (req, res) => {
    try{
        const users = await User.getUsers()
        res.status(200).json({users})
    } catch (error){
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    loginUser,
    signupUser,
    getUsers,
}