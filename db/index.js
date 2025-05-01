const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    purchasedCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'course'                            // ref needs internal model name.
        }
    ]
})

const AdminSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const CourseSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    price:{type:Number,required:true},
    imageLink:{type:String},
    published:{type:Boolean}
})

// mongoose.model(<internal_model_name>,<schema>,<preferred Collection Name>); 
const userModel = mongoose.model('user',UserSchema,'users');
const adminModel = mongoose.model('admin',AdminSchema,'admins');
const courseModel = mongoose.model('course',CourseSchema,'courses')

module.exports = {
    userModel,
    adminModel,
    courseModel
}

