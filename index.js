//npm init : packag.json---This is a node project
const express = require("express");
const mongoose = require("mongoose");
const app = express(); //express run as a function
const port=8000;
const authRoutes = require("./routes/auth")
require("dotenv").config();
const JwtStrategy = require("passport-jwt").Strategy,
        ExtractJwt=require("passport-jwt").ExtractJwt;
const passport=require("passport")
const User =require("./models/User")

const playlistRoutes = require("./routes/playlist")
const audiobookRoutes = require("./routes/audiobook")
const cors = require("cors");


app.use(cors())
app.use(express.json());
//connect mongodd to node
//mongoose.connect take 2 arugument : 1 which db to connect to (db url) :2 .connection options


mongoose.connect(
    "mongodb+srv://new_user_shubh:"+process.env.MONGO_PASSWORD +"@cluster0.5g5lmnv.mongodb.net/?retryWrites=true&w=majority",
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
    }
).then((x)=>{
    console.log("connection is esstablished");
})
.catch((err)=>{
    console.log(err);
})


//setup passport jwt
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload.identifier}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));


//API:GET type:/home:return text"heloo world"

app.get("/home",(req,res)=>{
    res.send("Hello World");
})

app.use("/auth",authRoutes)
app.use("/audiobook",audiobookRoutes)
app.use("/playlist",playlistRoutes)
//now we want to tell express that our server will run on localhost:4000
app.listen(port,()=>{
    console.log("app running"+port)
})