const Gif = require("./models/gif"); 
const User = require("./models/user"); 
const ProfilePicture = require("./models/profilePicture"); 
const mongoose = require("mongoose");


function TryNewDocument(){
    const newGif = new Gif({
        tags: ["#YoMama","#Shit","#Daaymm"],
        likes: [new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId(),
        new mongoose.Types.ObjectId()]
    });



    newGif.save(); 
}





module.exports = {TryNewDocument}; 

