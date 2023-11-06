const express = require('express');
const passport = require("../auth");
const User = require("../models/user"); 
const router = express.Router();
const bcrypt = require("bcryptjs");

const loginController = require("../controllers/loginController");


/* GET home page. */
router.get('/', loginController.index);

router.post("/", passport.authenticate("local", {
  successRedirect: "/main",
  failureRedirect: "/"
})
);

router.get("/sign_up", (req, res, next) => {
  res.render("signUp");
});

router.post("/sign_up", async (req, res, next) => {
  try
  {
    bcrypt.hash(req.body.password, 10, async(err, hashedPassword) => {
      
      if(err) return next(err);

      const newUser = new User({
        display_name: req.body.display_name,
        username: req.body.username,
        password: hashedPassword,
        date_created: new Date()
      });

      await newUser.save();
      res.redirect("/");
    });
  }
  catch(error)
  {
    return next(error);
  }
});

router.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if(error) return next(error);

    res.redirect("/");
  })
});



module.exports = router;
