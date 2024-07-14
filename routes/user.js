const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");
const user = require("../models/user.js");

router.route("/signup")
.get(userController.renderSignupPage)
.post(userController.signup)

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
passport.authenticate("local",
  { 
    failureRedirect: '/login' , 
    failurFlash: true
  }),userController.login)

router.get("/logout",userController.logout);

module.exports = router;