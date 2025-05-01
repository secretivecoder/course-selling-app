const {Router}  = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {adminModel} = require('../db');
const {courseModel} = require('../db');
const {adminAuthMiddleware} = require('../middleware/admin');

const jwt_secret = process.env.JWT_SECRET;

const router = new Router();

router.post('/signup',async (req,res)=>{
    const {username,password} = req.body;
    try {
        await adminModel.create({username,password});
    } catch (error) {
        return res.status(error.status||500).json({
            message:'error while signing you up as admin',
            error:error.message
        });
    }
    return res.status(201).json({message:'admin created successfully'});
})

router.post('/signin',async (req,res)=>{
    const {username,password} = req.body;
    if(!username||!password){
        return res.status(400).json({message:'username or password not detected'});
    }
    try {
        const admin = await adminModel.findOne({username}).lean();
        if(!admin){
            return res.status(404).json({message:'admin not found'});
        }
        if(admin.password!==password){
            return res.status(400).json({message:'incorrect credentials/password'});
        }
        const token = jwt.sign({id:admin._id.toString()},jwt_secret,{expiresIn:'1d'});
        return res.status(201).json({message:'user signin successful',token});
    } catch (error) {
        return res.status(500).json({message:'unknown error while signin in the admin',error:error.message});
    }
})

router.post('/courses',adminAuthMiddleware,async (req,res)=>{
    const {title,description,price,imageLink} = req.body;
    try {
        await courseModel.create({title,description,price,imageLink,published:false});
    } catch (error) {
        return res.status(500).json({
            message:'error while creating course as an admin',
            error: error.message
        })
    }
    return res.status(200).json({message:'course created successfully'});
})

router.get('/courses',adminAuthMiddleware,async (req,res)=>{
    try {
        const courses = await courseModel.find({}).lean();
        const formattedCourses=courses.map(({_id,...rest})=>({id:_id,...rest}));
        return res.status(200).json({
            courses: formattedCourses
        });
    } catch (error) {
        return res.status(500).json({
            message:'error while finding courses as an admin',
            error: error.message
        })
    }
})

module.exports = {router}
