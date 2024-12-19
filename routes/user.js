const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {isLoggedIn, saveUrl} = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(
    (userController.signuprender))
.post(
    wrapAsync(userController.signup));

router.route("/login")   
.get( 
    (userController.renderLogin))
.post(
    saveUrl,
    passport.authenticate
    ("local", 
    {failureRedirect : "/login",
    failureFlash : true}),
    (userController.login)
    );

router.get("/logout",
    (userController.logout));

module.exports = router;