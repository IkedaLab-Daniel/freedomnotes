const User = require('../models/UserModel')
const jwt = require('jsonwebtoken');

const signToken = ( {_id} ) => {
    const token = jwt.sign( {_id} , process.env.SECRET, { expiresIn : '3d'})
    return token
}

const loginUser = async (req, res) => {
    const { username , password } = req.body

    try {
        const user = await User.login( username , password);
        const token = signToken(user._id);
        res.status(200).json( { message : "Log In Successful!", user: user, token : token} );
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
        res.status(200).json({ message: "User create " + username, user : user, token : token});
    } catch (error){
        res.status(400).json({ error: error.message})
    }
} 

// TODO
const updateUser = (req, res) => {
    console.log('Hello Ice')
} 

module.exports = {
    loginUser,
    signupUser,
    updateUser,
}