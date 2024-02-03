const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main()
    .then(() => {
        console.log("connected to Db");
    })
    .catch((err) => {
        consol.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOption = {
    secret : "supersecretcode",
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httponly : true,
    },
};

app.get("/", (req, res) => {
    res.send("you are on the root node");
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));// authenticate() Generates a function that is used in Passport's LocalStrategyserializeUser() Generates a function that is used by Passport to serialize users into the sessiondeserializeUser() Generates a function that is used by Passport to deserialize users into the session

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser= req.user;
    next();
});

// app.get("/demouser", async (req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username:"alphastudent" 
//     });
    
//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter); //parent route agar hmara req.params parent se chlid ki taraf nhi jaara hai bcuz we r using router to ise ham sort karne ke liye to review.js ke router object me hum ek option bhejte hai{mergeParams :true}
app.use("/",userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs", { message });
});

app.listen(8080, () => {
    console.log("server is listening at the port 8080");
});
