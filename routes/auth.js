const express = require('express');
const User= require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


const JWT_SECRET = "Sukhdeep sharma secret"; 
//create a user using:POST "/api/auth/createuser". Does'nt require auth

router.post('/createuser',[
    body('name',"Enter a valid name").isLength({ min: 5 }),
    body('email',"Enter a valid email").isEmail(),
    body('password', "Password atleast 5 characters").isLength({ min: 5 })
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    // Check whether user with this email exists already
    let user= await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).json({error:"Sorry a user with this email exists"})
    }
    const salt = await bcrypt.genSalt(10); //generate salt
    const secPass = await bcrypt.hash(req.body.password,salt);
    // secPass= req.body.password;
    user = await User.create({ 
        name: req.body.name,
        email: req.body.email,
        password: secPass,
     })
     const data={
        user:{
            id: user.id
        }
     }

     const authtoken= jwt.sign(data,JWT_SECRET);
    //  console.log(authtoken);
     res.json({authtoken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Some error occured")
    }
})
module.exports = router;