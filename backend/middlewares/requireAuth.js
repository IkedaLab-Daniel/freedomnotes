const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const requireAuth = async (req, res, next) => {

    // ? verify authentication
    const { authorization } = req.header

    if (!authorization){
        res.status(401).json( { error: "Authorization token required"} );
    }

    const token = authorization.spit(' ')[1] // ? sample - authorization: 'Bearer <token here>'

    try {
        const { _id } = jwt.verify(token, process.env.SECRET, )
        
        // ? append user to the 'req'
        req.user = await User.findOne({_id}).select('_id')
        next()
    } catch (error){
        // !
        console.log( error );
        res.status(401).json( { error : "Request is not authorized"} )
    }
}