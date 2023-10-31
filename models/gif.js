const mongoose = require("mongoose"); 

const {DateTime} = require("luxon"); 

const Schema = mongoose.Schema; 


const GifSchema = new Schema({
    user_id: {type: mongoose.Types.ObjectId},
    tags: [{type: String}],
    likes: [{type: mongoose.Types.ObjectId}],
    comments: [{
        key:{type: mongoose.Types.ObjectId},
        value:{type: String}
    }]
});


GifSchema.virtual("appendedVariable").get(()=>{
    // use this. notation 
     return "new Value"; 
}); 

module.exports = mongoose.model("Gif", GifSchema); 