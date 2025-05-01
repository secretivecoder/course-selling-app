// // Middleware for handling auth
// function adminMiddleware(req, res, next) {
//     // Implement admin auth logic
//     // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
// }

// module.exports = adminMiddleware;

const {adminModel} = require('../db');


const adminAuthMiddleware = async(req,res,next)=>{
    const {username,password} = req.headers;
    if(!username||!password){
        return res.status(400).json({message:'credentials missing'});
    }
    try {
        const admin = await adminModel.findOne({username});
        if(!admin){
            return res.status(404).json({message:'admin not found in db'});
        }
        if(admin.password!==password){
            return res.status(403).json({message:'password is incorrect for the current admin'});
        }
    } catch (error) {
        return res.status(500).json({message:'unknown error while authenticating admin'});
    }
    next();
}


module.exports = {adminAuthMiddleware};