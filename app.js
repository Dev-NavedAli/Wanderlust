const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const Review = require("./models/review.js")

const MONGO_URL = "mongodb://127.0.0.1:27017/airbnb";

main().then(() => {
    console.log("connected to Db")
}).catch(err => {
    consol.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", (req, res) => {
    res.send("you are on the root node");
});

const validateListing = (req,res,next) =>{
    let {error}= listingSchema.validate(req.body);
    let errMsg = error.details.map((el) => el.message).join(",");
    if (error){
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}


//INDEX ROUTE
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})
);


// NEW ROUTE
app.get("/listing/new", (req, res) => {
    res.render("listings/new.ejs")
})

// SHOW ROUTE
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing })
})
);

// CREATE ROUTE
app.post(
    "/listings",validateListing,
    wrapAsync(async (req, res, next) => {
        
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })
);

// EDIT ROUTE
app.get("/listings/:id/edit",wrapAsync (async(req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    })
    );


// UPDATE ROUTE
app.put("/listings/:id",
        validateListing,
        wrapAsync (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
})
);

//DELETE ROUTE
app.delete(
    "/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})
);

// Reviews
// Post route 

app.post("/listing/:id/reviews", async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
});

// app.get("/testListing", async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "myphone",
//         description:"oheoihewh",
//         price: 1200,
//         location : "Delhi",
//         country : "India"
//     });

//     await sampleListing.save();
//     console.log("sample was saved ");
//     res.send("Succesfully saved");
// })

app.all("*", (req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
});

app.use((err, req, res, next) => {
    let {statusCode=500 , message="something went wrong"} = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{message});
});


app.listen(8080, () => {
    console.log("server is listening at the port 8080");
})