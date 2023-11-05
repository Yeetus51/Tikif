const express = require('express');
const passport = require("../auth");
const User = require("../models/user"); 
const router = express.Router();
const bcrypt = require("bcryptjs");

const createPostController = require("../controllers/createPostController");


/* GET home page. */
router.get('/', createPostController.index);

// POST Search Request
router.post("/", createPostController.search);

//GET Search Results Page
router.get("/results/:query", createPostController.results);

//POST Choose Gif
router.post("/results/:query", createPostController.choosePost);

//GET Create Post Page 
router.get("/post/:query", createPostController.createPost)

//POST Post created
router.post("/post/:query", createPostController.postCreated)





module.exports = router;
