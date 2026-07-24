const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');





const router = express.Router();
function signToken(userId){
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

router.post('/signup', async(req, res)=>{
    try{
        const {name, email, password} = req.body || {};
        const normalizedEmail = email && email.toLowerCase().trim();
        if(!name || !normalizedEmail || !password){
            return res.status(400).json({message:"Name, email, and password are all required"})
        }
        if(password.length < 6){
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }
        const existing = await User.findOne({email: normalizedEmail});
        if(existing){
            return res.status(400).json({message:"User already exists"})
        }
        const user = await User.create({name: name.trim(), email: normalizedEmail, password});
        const token = signToken(user._id);
        return res.status(201).json({token, user: {id:user._id, name:user.name, email:user.email}})
    }
    catch(error){
        return res.status(500).json({message: "Could not create account", error: error.message});
    }
});

router.post('/login', async(req, res)=>{
    try{
        const {email, password}= req.body;
        if(!email || !password){
            return res.status(400).json({message:"Email and password are required"});
        }
        // include password for comparison (if password is select:false in schema)
        const user = await User.findOne({email:email.toLowerCase()}).select('+password');
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({message:"Incorrect email and password"})
        }

        const token = signToken(user._id);
        res.json({token, user:{id:user._id, name:user.name, email:user.email}});
    }
     catch(error){
        return res.status(500).json({message: "Could not create account", error: error.message});
    }
})


router.get('/me', requireAuth, async(req, res)=>{
    const user = await User.findById(req.userId);
    if(!user) return res.status(404).json({message: "User not found"});
    res.json({user:{id:user._id, name:user.name, email:user.email}})
})

module.exports = router;


