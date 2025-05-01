const {Router}  = require('express');

const {adminModel} = require('../db');
const {courseModel} = require('../db');
const {adminAuthMiddleware} = require('../middleware/admin');

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
