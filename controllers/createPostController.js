const asyncHandler = require("express-async-handler");


// GET Index Page
exports.index = asyncHandler(async (req, res, next) => {


    res.render("createPost");
});


// POST search request
exports.search = asyncHandler(async (req, res, next) =>{
    try{
        res.redirect(`create_post/results/${req.body.search_gif}`);
    }catch(error){
        console.log(error);
    }
});



//GET results Page
exports.results = asyncHandler(async (req, res, next) =>{

    const apiKey = 'cCqvdNc7RryxD4v9Ff4951YQ08xXgDsb'; // USE ENV KEY!! 
    const baseUrl = 'https://api.giphy.com/v1/gifs/search';
  
    const promises = [];

    const url = `${baseUrl}?api_key=${apiKey}&q=${req.params.query}&offset=${0}`;  // WE USING THE SEARCH ENDPOINT
    promises.push(
    fetch(url, { mode: 'cors' })
        .then(res => res.json())  // parse the response as JSON
        // .then(data => data)  // if you only want the 'data' part of the response
    );

    
  // Wait for all promises to resolve
    const results = await Promise.all(promises);

    console.log(results[0].data[0]);

    
    res.render("gifSearchResult", {input:req.params.query, results: results})

});