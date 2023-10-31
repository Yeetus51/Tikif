const express = require('express');
const passport = require("../auth");
const User = require("../models/user"); 
const router = express.Router();
const bcrypt = require("bcryptjs");

const accountController = require("../controllers/accountController");


/* GET home page. */
router.get('/', accountController.index);


module.exports = router;
