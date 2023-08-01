const express = require('express');
const User= require('../models/User');
const router = express.Router();



//create a user using:POST "/api/auth". Does'nt require auth

router.post('/',async (req,res)=>{

console.log(req.body);
const user = await User(req.body);
user.save();
res.send(req.body);

})
module.exports = router;