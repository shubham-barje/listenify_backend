const mongoose = require("mongoose");
//How to create a model
//step1: reqire mongoose
//step2:create schema
//step 3:crteate a model

const AudiobookSchema = new mongoose.Schema({
   name:{
    type:String,
    require:true,
   },
   thumbnail:{
    type:String,
    require:true,
   },
   track:{
    type:String,
    require:true,
   },
   artist:{
    type:mongoose.Types.ObjectId,
    ref:"User",
   }
})
const Audiobook = mongoose.model("Audiobook",AudiobookSchema)
module.exports=Audiobook ;