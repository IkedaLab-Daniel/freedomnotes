const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const requireAuth = async (req, res, next) => {

    // ? verify authentication
    const { authorization } = req.headers

    if (!authorization){
        res.status(401).json( { error: "Authorization token required"} );
    }

    const token = authorization.split(' ')[1] // ? sample - authorization: 'Bearer <token here>'

    try {
        const { _id } = jwt.verify(token, process.env.SECRET)
        
        // ? append user to the 'req'
        const user = await User.findOne({_id}).select('_id role')
        if (!user){
            res.status(401).json({ error : "User not found" })
        }

        req.user = user;
        next()
    } catch (error){
        if ( error.name === 'TokenExpiredError'){
            res.status(401).json({ error: 'Session Expired'})
            return
        }
        console.error( error );
        res.status(401).json( { error : "Request is not authorized"} )
    }
}

const requireAdmin = (req, res, next) => {

    if (!req.user){
        return res.status(403).json({ error: "Missing req.user"});
    }
    if (!req.user.role){
        return res.status(403).json( {error: "Missing req.user.role"})
    }
    if (req.user.role !== "admin"){
        return res.status(403).json( {error: "You're ain't no Ice"})
    }
    next();
}

module.exports = {
    requireAuth,
    requireAdmin
};