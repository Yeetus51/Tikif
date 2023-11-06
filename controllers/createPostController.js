const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");

User = require("../models/user");
Gif = require("../models/gif");


// GET Index Page
exports.index = asyncHandler(async (req, res, next) => {


    res.render("gifSearch");
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

    const moreRequest = req.query.offset? true: false; 
    const offset =  req.query.offset || 0
    const query = req.params.query; 
  
    const url = `${baseUrl}?api_key=${apiKey}&q=${req.params.query}&limit=${12}&offset=${offset}`;  // WE USING THE SEARCH ENDPOINT

    try {
        const response = await fetch(url);
        const data = await response.json();

        const urlsAndIds = data.data
        .filter(item => item.images && item.images.fixed_height && item.id)
        .map(item => ({ url: item.images.fixed_height.url, id: item.id }));

        if(moreRequest){
            res.send(urlsAndIds);
        }else{
            res.render("gifSearchResult", {
                input: query,
                results: urlsAndIds,
                offset: offset + 12 // Prepare for the next offset
              });
        }
      } catch (error) {
        // Handle the error
        console.error(error);
        res.status(500).send('Server Error');
      }
});


// POST choose Post Page
exports.choosePost = asyncHandler(async (req, res, next) =>{

    res.status(200).json({ success: true, message: "Post choosen" });
})


//GET Create Post Page
exports.createPost = asyncHandler(async (req, res, next) =>{ 

    const apiKey = process.env.GIHPY_KEY; 
    const baseUrl = 'https://api.giphy.com/v1/gifs/';

    const id = req.params.query; 

    const url = `${baseUrl}${id}?api_key=${apiKey}`;  // WE USING THE SEARCH ENDPOINT

    try {
        const response = await fetch(url);
        const data = await response.json();

        const urlsAndIds = {url: data.data.images.fixed_height.url, id: data.data.id};

        res.render("createPostPage", {
            result: urlsAndIds
        })

    }
    catch(error){
        // Handle the error
        console.error(error);
        res.status(500).send('Server Error');
    }
});

//POST post Submitted 
exports.postCreated = asyncHandler(async (req, res, next) => {

    console.log(req.user._id);
    try {
        // Create a new Gif document from the request body
        const newGif = new Gif({
            user_id: req.user._id, // assuming req.user is populated with the logged-in user's info
            gif_id: req.body.gif_id,
            title: req.body.gif_title, // assuming title is passed in request body
            tags: ["Some", "Hash", "tags"], // assuming tags is an array passed in request body
            date_posted: new Date()            // Initialize other fields as needed, like likes, comments, viewers
        });

        // Save the new Gif to the database
        saveGifResult = await newGif.save();
        console.log(saveGifResult);

        // Update the user's gif_posts field to include the new Gif
        // Assuming the User model has a field `gif_posts` which is an array of ObjectIds
        updateUserResult = await User.updateOne(
            { _id: req.user._id }, 
            { $push: { gif_posts: newGif._id } }
        );
        console.log(updateUserResult);


        // Redirect to the main page after successful creation
        res.redirect("/main");
    } catch (error) {
        // Handle the error appropriately
        console.error(error);
        res.status(500).send("Server error");
    }
});