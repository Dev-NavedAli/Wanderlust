const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js")
const {isLoggedIn, isOwner , validateListing} = require("../middleware.js");



//INDEX ROUTE
router.get(
    "/",
    wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})
);


// NEW ROUTE
router.get("/new", isLoggedIn,(req, res) => {
    res.render("listings/new.ejs")
})

// SHOW ROUTE
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
})
);

// CREATE ROUTE
router.post(
    "/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id ;  //req.user me curr user ki id req.user._id me save hoti hai jisko passport by default save karata hai or is line se hum ye bata rahe hai jo hmara newListing ka owner ho uske andar currrent user ki hi id store ho
        await newListing.save();
        req.flash("success", "New Listing Created!")
        res.redirect("/listings");
    })
);

// EDIT ROUTE
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync (async(req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing you requested for does not exist");
            res.redirect("/listings");
        };
        res.render("listings/edit.ejs", { listing });
    })
    );


// UPDATE ROUTE
router.put("/:id",
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", " Listing Updated!")
    res.redirect(`/listings/${id}`);
})
);


//DELETE ROUTE
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    console.log(deletedListing);
    res.redirect("/listings");
})
);

module.exports = router;