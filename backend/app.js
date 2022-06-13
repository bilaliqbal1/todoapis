const express = require('express');
const app = express();
const mongoose = require('mongoose');

//to handle json format data
app.use(express.urlencoded({extended: false}))
app.use(express.json())

const todoRoutes = require('./api/routes/list');
const taskRoutes = require('./api/routes/task');
const signUpRoutes = require('./api/routes/user');
require('dotenv').config();

//Controlling routes
app.use('/list',todoRoutes);
app.use('/task',taskRoutes);
app.use('/users', signUpRoutes); 
app.use('/uploads', express.static('uploads'));

//database connection
mongoose.connect(process.env.MONGO_ATLAS_URL)

//handling errors
app.use((req, res,next) =>{
    const error = new Error('Not Found')
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({
        error:{
            message: error.message
        }
    })
})
module.exports = app;