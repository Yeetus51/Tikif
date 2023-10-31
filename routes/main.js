const express = require('express');
const passport = require("../auth");
const User = require("../models/user"); 
const router = express.Router();
const bcrypt = require("bcryptjs");

const mainController = require("../controllers/mainController");


/* GET home page. */
router.get('/', mainController.index);






// // GET Acceptance Page
// router.get("/acceptance", acceptance_controller.index);

// // GET Adoption Page
// router.get("/adoption", adoption_controller.index);

// // GET Implementation Page
// router.get("/implementation", implementation_controller.index);


module.exports = router;
