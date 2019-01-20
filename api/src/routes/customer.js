import User from "../models/user";
import _ from 'lodash'
import {checkAuth} from '../models/auth'
const express = require('express');
const router = express.Router();

//create a new user
router.post('/',(req,res)=>{

    const body = _.get(req, 'body');
    const app = _.get(req,'app');
    const user = new User(app);
    user.initWithObject(body).create((err, newUser) => {
        console.log("New user created with error & callback: ", err, newUser);
        if(err){
            return res.status(400).json({
                error: {message: err}
            });
        }
        return res.status(200).json(newUser);
    });
});

//login user action
router.post('/login',(req,res)=>{
    const body = _.get(req, 'body', {});
    const app = _.get(req,'app');
    const user = new User(app);
    const email = _.get(body, 'email');
    const password = _.get(body, 'password');
    // make a call to  the user login callback func
    user.login(email, password, (err, token) => {

        if(err){
            return res.status(401).json({
                message: err.message
            });
        }

        return res.status(200).json(token);
    });
});


export default router


