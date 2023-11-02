const express = require('express');
const passport = require("../auth");
const User = require("../models/user"); 
const router = express.Router();
const bcrypt = require("bcryptjs");

const mainController = require("../controllers/mainController");


/* GET home page. */
router.get('/', mainController.index);


module.exports = router;
