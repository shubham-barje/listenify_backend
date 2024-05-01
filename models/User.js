const mongoose = require("mongoose");
//How to create a model
//step1: reqire mongoose
//step2:create schema
//step 3:crteate a model

const User = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        private:true,
    },
    lastName:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:false,
    },
    username:{
        type:String,
        required:false,
    },
    likedAudiobooks:{
        //later on create an array
        type:String,
        default:"",
    },
    likedPlaylist:{
        //later on create an array
        type:String,
        default:"",
    },subscribedArtists:{
        //later on create an array
        type:String,
        default:"",
    }
})
const UserModel = mongoose.model("User",User)
module.exports= UserModel;