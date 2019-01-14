const express = require('express');
const router = express.Router();

//create a new user
router.get('/',(req,res)=>{
    res.json("users")
});
//login user action
router.post('/login',(req,res)=>{
    res.json("users")
});

export default router


