const jwt = require('jsonwebtoken');

const generateJWT = (id)=>{
    var token = jwt.sign({id}, process.env.JWT_SECRET, { expiresIn: '8h' });
    
    return token;
}
module.exports = generateJWT;