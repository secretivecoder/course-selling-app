const {Router} = require('express');

const {userModel,courseModel} = require('../db');
const userAuthMiddleware = require('../middleware/user')

const router = new Router();

router.post('/signup',async (req,res)=>{
    const {username,password} = req.body;
    try {
        await userModel.create({username,password});
    } catch (error) {
        return res.status(500).json({message:'error signing up the user',
            error:error.message
        });
    }
    return res.status(200).json({message:'User created successfully'});
})

router.get('/purchasedCourses',userAuthMiddleware,async (req,res)=>{
    const {username} = req;
    try {
        const user = await userModel.findOne({username}).populate('purchasedCourses').lean();
        // const purchasedCourses = user.purchasedCourses.map(({_id,...rest})=>({id:_id,...rest}));// would send the .save() and extra meta data if not .lean()
        const purchasedCourses = user.purchasedCourses.map(course => {
            const { _id,...rest} = course;
            return {
                id: _id,
                ...rest
            };
        });

        return res.status(200).json({ purchasedCourses });
    } catch (error) {
        return res.status(500).json({
            message:'error while viewing courses of current user',
            error: error.message
        });
    }
})

router.post('/courses/:courseId',userAuthMiddleware,async (req,res)=>{
    const{username} = req;
    const courseId = req.params.courseId;
    try {
        const course = await courseModel.findOne({_id:courseId});
        if(!course){
            return res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        return res.status(500).json({message:'error while validating course while purchasing as a user',
            error:error.message
        })
    }
    try {
        const user = await userModel.findOne({username});
        // Check if courseId already exists in user's purchasedCourses
        if (user.purchasedCourses.includes(courseId)) {
            return res.status(409).json({ message: 'Course already purchased' });
        }
        user.purchasedCourses.push(courseId);
        await user.save();
        res.status(200).json({message:'Course purchased successfully'});
    } catch (error) {
        return res.status(500).json({message:'error while purchasing courses as current user',
            error:error.message
        })
    }
})

router.get('/courses',async (req,res)=>{
    try {
        // const courses = (await courseModel.find({}).lean()).map(({_id,...rest})=>({id:_id,...rest}));
        const raw = await courseModel.find({}).lean(); // ✔ Get plain JS objects, fast
        const transform = ({ _id, ...rest }) => ({ id: _id, ...rest }); // ✔ Rename _id to id
        const courses = raw.map(transform); // ✔ Pure transformation
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({message:'error viewing all courses as users',
            error:error.message
        })
    }
})
module.exports = {router};






