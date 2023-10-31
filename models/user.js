const mongoose = require("mongoose"); 

const {DateTime} = require("luxon"); 

const Schema = mongoose.Schema; 


const UserSchema = new Schema({
    username: {type: String},
    display_name: {type: String},
    password: {type: String},
    liked_gifs: [{type: mongoose.Types.ObjectId}],
    tag_intrest: [{
        key:{type:String},
        value:{type:mongoose.Types.Decimal128}
    }],
    gif_posts: [{type:mongoose.Types.ObjectId}]
});


UserSchema.virtual("appendedVariable").get(()=>{
    // use this. notation 
     return "new Value"; 
}); 

module.exports = mongoose.model("User", UserSchema); 