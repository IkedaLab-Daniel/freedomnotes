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
        const user = await User.findOne({_id}).select('_id') // ? Only get and attach the _id key
        if (!user){
            res.status(401).json({ error : "User not found" })
        }

        req.user = user;
        next()
    } catch (error){
        console.log( error );
        res.status(401).json( { error : "Request is not authorized"} )
    }
}

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin"){
        res.status(403).json({ error: "拒绝访问。"})
    }
    next();
}

module.exports = {
    requireAuth,
    requireAdmin
};