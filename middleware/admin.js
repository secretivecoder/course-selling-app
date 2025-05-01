
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {adminModel} = require('../db');

const jwt_secret = process.env.JWT_SECRET;

const adminAuthMiddleware = async(req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(404).json({message:'authorization field not found in headers'});
    }
    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(404).json({message:'token not found'});
    }
    try {
        const result = jwt.verify(token,jwt_secret);
        req.id = result.id;
    } catch (error) {
        return res.status(400).json({message:'invalid token',error:error.message});
    }
    try {
        const admin = await adminModel.findOne({_id:req.id});
        if(!admin){
            return res.status(404).json({message:'admin not found in db'}); // incase when admin is removed but the token is valid for some time.
        }
        // if(admin.password!==password){  not needed as if the token exists means the user did sign up.
        //     return res.status(403).json({message:'password is incorrect for the current admin'});
        // }
    } catch (error) {
        return res.status(500).json({message:'unknown error while authenticating admin',error:error.message});
    }
    next();
}


module.exports = {adminAuthMiddleware};