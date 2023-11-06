const asyncHandler = require("express-async-handler");

const mongoose = require("mongoose");
const Gif = require("../models/gif"); 
const Post = mongoose.model('gifs',Gif.schema);



function getRandomIntInRange(x, y) {
    if (x > y) {
      // Swap x and y if x is greater than y
      [x, y] = [y, x];
    }
    // Calculate the random integer within the range
    return Math.floor(Math.random() * (y - x + 1)) + x;
  }


exports.index = asyncHandler(async (req, res, next) => {


    try {

        const resultLimit = 50; 
        const result = await Post.find().sort({date_posted:-1}).limit(resultLimit); // This will find all documents in the posts collection
        

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

        res.render("main", {
            results: gifResults 
        });

        

    } catch (error) {
        console.error("Error finding posts:", error);
        throw error; // or handle error as needed
    }



});