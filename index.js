const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

const {router:adminRouter} = require('./routes/admin');
const {router:userRouter} = require('./routes/user');

const PORT = process.env.PORT;
const URL = process.env.MONGO_DB_URL;
const app = new express();

app.use(express.json());

app.use('/admin',adminRouter);
app.use('/user',userRouter);

mongoose.connect(URL).then(()=>console.log('connected to db'))
.catch(()=>{
    console.error('DB connection error:', error.message);
    process.exit(1);  // Exit the process if database connection fails
});

app.listen(PORT,()=>{
    console.log('server is running on: '+PORT);
})
