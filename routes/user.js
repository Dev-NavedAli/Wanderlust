const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local",    //passport.authenticate ek middleware hai jo apne aap check kr lega database me ki id pass sahi hai ya galat we dont need to write the code.
        {failureRedirect: '/login',
        failureFlash: true
        }),
        userController.login
        );

router.get("/logout",userController.logout)

module.exports = router;