const express = require("express");
const passport = require("passport");
const router = express.Router();
const Audiobook = require("../models/Audiobook");
const User = require("../models/User")

// Create a new Audiobook
router.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { name, thumbnail, track } = req.body;
    if (!name || !thumbnail || !track) {
        return res.status(400).json({ error: "Insufficient details to create Audiobook" });
    }
    const artist = req.user._id;
    const audiobookDetails = { name, thumbnail, track, artist };

    const createdAudiobook = await Audiobook.create(audiobookDetails);
    return res.status(200).json(createdAudiobook)
}
)

// Get all Audiobooks published by the current user
router.get("/get/myaudiobooks", passport.authenticate("jwt", { session: false }), async (req, res) => {
    //.populate is used to access object which is in the mongodb
    const audiobooks = await Audiobook.find({ artist: req.user._id }).populate("artist")
    return res.status(200).json({ data: audiobooks })
});


//getroute to get all Audiobooks any artist has published
//I will send the artist id and I want to see all Audiobooks that artist has published.
//create link search Audiobook
router.get("/get/artist/:artistId",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { artistId } = req.params;
        
    
        const artist = await User.findOne({ _id: artistId })
        console.log(artist)
        //![]=false
        //!null = true
        //undefined = true
        if (!artist) {
            return res.status(301).json({ err: "Artist does ot exist" })
        }
        const audiobooks = await Audiobook.find({ artist: artistId });
        return res.status(200).json({ data: audiobooks })
    })


//Get route to get a single Audiobook by name
router.get("/get/audiobookname/:audiobookName",
    passport.authenticate("jwt", { session: false }),
    async (req, res) => {
        const { audiobookName } = req.params;
        
        //name:AudiobookName ==> exact name matching
        //pattern matching insted of direct name matching
        const audiobooks = await Audiobook.find({ name: audiobookName}).populate("artist");
        return res.status(200).json({ data: audiobooks })
    })
module.exports = router;