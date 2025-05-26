const User = require('../models/UserModel')

const loginUser = async (req, res) => {
    const { username , password } = req.body

    try {
        const user = await User.login( username , password);
        res.status(200).json( { message : "Log In Successful!", user: user} );
        console.log('A user successfully logged in:', user.username);
    } catch (error) {
        res.status(400).json( { error: error.message })
    }

}

const signupUser = async (req, res) => {
    const { username , password } = req.body

    try{
        const user = await User.signup(username, password)
        res.status(200).json({ message: "User create " + username})
    } catch (error){
        res.status(400).json({ error: error.message})
    }
} 

const updateUser = (req, res) => {
    console.log('Hello Ice')
} 

module.exports = {
    loginUser,
    signupUser,
    updateUser,
}