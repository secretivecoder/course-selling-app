const {userModel} = require('../db');


function userMiddleware(req, res, next) { // promises used
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    const {username,password} = req.headers;
    if(!username||!password){
        return res.status(400).json({message:'credentials missing'});
    }
    userModel.findOne({username}).then((user)=>{
        if(!user){
            return res.status(404).json({message:'user not found'});
        }
        if(user.password!==password){
            return res.status(403).json({message:'password is incorrect for the current user'});
        }
        req.username = username;
        next();
    })
    .catch((error)=>{
        return res.status(500).json({message:'error occured while authenticating user',
            error: error.message
        })
    })
}

module.exports = userMiddleware;