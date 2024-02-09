const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.logIn(registeredUser,(err)=>{   //isme agar signup succesfully hua to user automatically login hojayega req.login ki help se //
            if(err){
                return next(err);
            }
            req.flash("success", "User registered Succesfully");
            res.redirect("/listings");
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs")
}

module.exports.login = async (req, res) => {
    req.flash("success","Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings" ; 
    res.redirect(redirectUrl)
}

module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out now");
        res.redirect("/listings");
    });
};