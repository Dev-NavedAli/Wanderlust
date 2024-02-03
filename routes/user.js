const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.flash("success", "User registered Succesfully");
        res.redirect("/listings");
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs")
})

router.post("/login",
    passport.authenticate("local",    //passport.authenticate ek middleware hai jo apne aap check kr lega database me ki id pass sahi hai ya galat we dont need to write the code.
    {failureRedirect: '/login',
    failureFlash: true
    }),
    async (req, res) => {
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listings")
    }
    );

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    });
})


module.exports = router;