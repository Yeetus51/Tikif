const mongoose = require("mongoose"); 

const {DateTime} = require("luxon"); 

const Schema = mongoose.Schema; 


const GifSchema = new Schema({
    user_id: {type: mongoose.Types.ObjectId, ref:"User"},
    title: {type: String},
    tags: [{type: String}],
    gif_id: {type: String},
    likes: [{type: mongoose.Types.ObjectId}],
    comments: [{
        key:{type: mongoose.Types.ObjectId},
        value:{type: String}
    }],
    viewers: [{type: mongoose.Types.ObjectId}],
    date_posted: {type: Date}
});

GifSchema.virtual("appendedVariable").get(()=>{
    // use this. notation 
     return "new Value"; 
}); 

module.exports = mongoose.model("Gif", GifSchema); 