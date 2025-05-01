
require('dotenv').config();
const jwt = require('jsonwebtoken');
const {userModel} = require('../db');

const jwt_secret = process.env.JWT_SECRET;

function userMiddleware(req, res, next) { // promises used
    if(!req.headers.authorization){
        return res.status(404).json({message:'authorization field not found in headers'});
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
        const result = jwt.verify(token,jwt_secret);
        req.id = result.id;
    } catch (error) {
        return res.status(400).json({message:'invalid token',error:error.message});
    }
    userModel.findOne({_id:req.id}).then((user)=>{
        if(!user){
            return res.status(404).json({message:'user not found'});
        }
        req.user = user;
        next();
    })
    .catch((error)=>{
        return res.status(500).json({message:'error occured while authenticating user',
            error: error.message
        })
    })
}

module.exports = userMiddleware;