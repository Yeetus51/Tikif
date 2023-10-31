const mongoose = require("mongoose"); 

const {DateTime} = require("luxon"); 

const Schema = mongoose.Schema; 


const ProfilePictureSchema = new Schema({
    raw_data: {type: String},
    meta_data: {type: String}
});


ProfilePictureSchema.virtual("appendedVariable").get(()=>{
    // use this. notation 
     return "new Value"; 
}); 

module.exports = mongoose.model("profile_picture", ProfilePictureSchema); 