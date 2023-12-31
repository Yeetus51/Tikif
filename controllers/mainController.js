const asyncHandler = require("express-async-handler");

const mongoose = require("mongoose");
const Gif = require("../models/gif"); 
const UserSchema = require("../models/gif"); 
const Post = mongoose.model('gifs',Gif.schema);
const User = mongoose.model('users',UserSchema.schema);

const resultLimit = 10; 
const sentResults = 5; 

function getRandomIntInRange(x, y) {
    if (x > y) {
      // Swap x and y if x is greater than y
      [x, y] = [y, x];
    }
    // Calculate the random integer within the range
    return Math.floor(Math.random() * (y - x + 1)) + x;
  }


exports.index = asyncHandler(async (req, res, next) => {

    if(req.query.gif_id){
        return exports.requestMore(req, res);;
    }


    try {


        const result = await Post.find()
        .sort({ date_posted: -1 })
        .limit(resultLimit)
        .populate({
          path: 'user_id', // This is the field name in GifSchema that holds the reference
          select: 'username' // Fields to include from the User collection
          // Make sure these field names match the ones in the UserSchema
        });

        console.log(result[0]); 
        

        let gifData = result.map(item => ({ gif_id: item.gif_id, title: item.title, username: item.user_id.username}));

        if(gifData.length >= sentResults){
            for (let i = 0; i < result.length - sentResults; i++){
                const random = getRandomIntInRange(0,gifData.length-1);
                gifData.splice(random,1);
            }
        }

        let promises = []; 
        const apiKey = process.env.GIHPY_KEY;
        const baseUrl = 'https://api.giphy.com/v1/gifs/';

        for (let i = 0; i < gifData.length; i++) { 
            const url = `${baseUrl}${gifData[i].gif_id}?api_key=${apiKey}`;
            const fetchPromise = fetch(url)
                .then(response => response.json())
                .then(result => {
                    return {
                        url: result.data.images.fixed_height.url, 
                        id: result.data.id,
                        title: gifData[i].title,
                        username: gifData[i].username
                    };
                })
                .catch(error => {
                    console.error("Error fetching data for gifId: " + gifData[i].gif_id, error);
                    return null; // Return null or an object with error information
                });

            promises.push(fetchPromise);
        }

        gifResults = await Promise.all(promises)
            .then(results => {
                // Filter out any null results in case of errors
                return results.filter(result => result != null);
            })
            .catch(error => {
                console.error("Error in Promise.all: ", error);
                return []; // Return an empty array or handle as needed
            });

        res.render("main", {
            results: gifResults 
        });

        

    } catch (error) {
        console.error("Error finding posts:", error);
        throw error; // or handle error as needed
    }
});

exports.requestMore = asyncHandler(async (req, res, next) =>{


    try{

        const lastGif = await Post.findOne({gif_id:req.query.gif_id})

        const result = await Post.find({
            date_posted: { $lt: lastGif.date_posted }
        })
        .sort({ date_posted: -1 }) 
        .limit(resultLimit); 


        

        let gifData = result.map(item => ({ gif_id: item.gif_id, title: item.title }));

        if(gifData.length >= 10){
            for (let i = 0; i < result.length - 10; i++){
                const random = getRandomIntInRange(0,gifData.length-1);
                gifData.splice(random,1);
            }
        }

        let promises = []; 
        const apiKey = process.env.GIHPY_KEY;
        const baseUrl = 'https://api.giphy.com/v1/gifs/';

        for (let i = 0; i < gifData.length; i++) { 
            const url = `${baseUrl}${gifData[i].gif_id}?api_key=${apiKey}`;
            const fetchPromise = fetch(url)
                .then(response => response.json())
                .then(result => {
                    return {
                        url: result.data.images.fixed_height.url, 
                        id: result.data.id,
                        title: gifData[i].title // Carry over the title here
                    };
                })
                .catch(error => {
                    console.error("Error fetching data for gifId: " + gifData[i].gif_id, error);
                    return null; // Return null or an object with error information
                });

            promises.push(fetchPromise);
        }

        gifResults = await Promise.all(promises)
            .then(results => {
                // Filter out any null results in case of errors
                return results.filter(result => result != null);
            })
            .catch(error => {
                console.error("Error in Promise.all: ", error);
                return []; // Return an empty array or handle as needed
            });

        res.json({
            results: gifResults 
        });


    }catch(error){
    }



})