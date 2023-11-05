const asyncHandler = require("express-async-handler");

const mongoose = require("mongoose");
const Gif = require("../models/gif"); 
const Post = mongoose.model('gifs',Gif.schema);

exports.index = asyncHandler(async (req, res, next) => {


    try {
        const result = await Post.find(); // This will find all documents in the posts collection
        
        console.log(result);

        let gifData = result.map(item => ({ gif_id: item.gif_id, title: item.title }));
        console.log(gifData);
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

        console.log(gifResults);

        res.render("main", {
            results: gifResults 
        });

        

    } catch (error) {
        console.error("Error finding posts:", error);
        throw error; // or handle error as needed
    }



});