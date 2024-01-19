const jwt = require('jsonwebtoken');

const refreshJWT = (id)=>{
    var token = jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    return token;
}
module.exports = refreshJWT;