//authentication
const express = require("express");
const router = express.Router()//Router beacuse we need only routing in this 
const User = require("../models/User")
const bcrpty = require("bcrypt")
const {getToken} = require("../utils/helpers")



//This post route will help to register the user
router.post("/register", async (req,res)=>{
    //This code is run when the /register api is called as POST request
    //My req.body will be of the format (email,firstName,LastName,password,username,)
    const{email,password,firstName,lastName,username} = req.body;

    //step2:Does a user with this email already exsit? if yes,we throw error
    const user = await User.findOne({email:email});
    if(user){

        //400,401,402,404 implies error (verification error)
        return res
            .status(403)
            .json({error:"user with this email is alreay exists"})
            
    }
    //This is valid user
    //Step 3: Creaate a new user in the DB
    //Step 3.1: We do not store password in plain text
    //if pass is XYZ :we convert the plain text password to hash. we add hash feature 
    const hashedPassword = await bcrpty.hash(password,10); //bcrpty is is hashing function so we install it
    const newUserData = 
        {   email,
            password:hashedPassword,
            firstName,
            lastName,
            username
        };
        
    const newUser = await User.create(newUserData);

    //Step 4: We want to create a token to return the user
    const token = await getToken(email,newUser);

    //Step 5: Retuen the result to the user
    const userToReturn = {...newUser.toJSON(),token}//it convert the user data in json (keya nd value pair)

    delete userToReturn.password;
    return res.status(200).json(userToReturn);

})


router.post("/login",async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(403).json({err:"invalid credintials"})
    }

    const isPasswordValid = await bcrpty.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(403).json({err:"invalid credintials"})
    }

    const token = await getToken(user.email,user);
    const userToReturn = {...user.toJSON(),token}//it convert the user data in json (keya nd value pair)
    delete userToReturn.password;
    return res.status(200).json(userToReturn);


})

module.exports = router;
