const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview} = require("../middleware.js")



//  Post  Review route   ......chlid route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);  //hum us listing ko acces krenge jiski id yha hmne di hai
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!")

    res.redirect(`/listings/${listing._id}`); //not match as  mentors projects (`/listings/${listing._id}`);
})
);

//DELETE REVIEW ROUTE    .....child route
router.delete(
    "/:reviewId",
    wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) //reviews array me jis bhi review se  reviewid match kar jaaye hum us id pull krna chchte hai 
    await Review.findById(reviewId);
    req.flash("success", "Review Deleted")

    res.redirect(`/listings/${id}`);
}))

module.exports = router;
