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
router.get("/results/:query", createPostController.results)


module.exports = router;
