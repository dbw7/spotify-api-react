const jwt = require('jsonwebtoken');
//require('dotenv').config()

module.exports = (req, res, next) => {
    //console.log("auth", req.headers.authorization)
    try {
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            throw new Error('Authentication failed');
        }
        // Random string should be an environment variable
        const decodedToken = jwt.verify(token, "THIS NEEDS TO BE A SECRET RANDOM STRING");
        req.userData = {id: decodedToken.id, email: decodedToken.email};
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Authentication failed!' });
    }
    
}