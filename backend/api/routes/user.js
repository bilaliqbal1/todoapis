const express = require('express');
const mongoose = require('mongoose')
const router = express.Router();
const User = require('../../model/user');
const bcrypt =  require("bcrypt");
const jwt = require('jsonwebtoken');

//adding user 
router.post('/signUp', async (req, res) =>{
    const { email, password } = req.body;
    if(email && password){
        const checkUser = await User.findOne({email: email})
        if(checkUser){
            return res.send({
                message: "User Already exists"
            })
        }
        try {
            bcrypt.hash(password, 10, async (err, hash) => {
                if(err){
                    res.send(err)
                }else{
                    const user = await new User({
                        email: email,
                        password: hash
                    }).save();
                    res.send(user); 
                }
            })
        } catch (error) {
            res.json({message: error.message})
        }
    }else{
        res.json({
            message: "Email or Password don't be empty"
        })
    }
})

//login user route
router.post('/login', async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if(user){
            bcrypt.compare(req.body.password, user.password, async (error, results) =>{
                if(error){
                    res.status(500).json({
                        message : "Error Occured",
                        error
                    })
                }
                if(results){
                    //creating token if user get resultes
                    const token = jwt.sign(
                        {
                            email : user.email,
                            userId : user._id
                        },
                        process.env.JWT_KEY,{
                            expiresIn: '1h'
                        }
                    );
                    return res.json({
                        user : {
                            email : user.email,
                            token : token
                        },
                        message: "Authentication Successfull"
                    })
                }
            })
    }else{
        res.json({
            message: "User Not Found"
        })
    }
    
})






module.exports = router;
