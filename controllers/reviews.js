const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res)=>{
    let {id} = req.params
    let listing = await Listing.findById(id);  //hum us listing ko acces krenge jiski id yha hmne di hai
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!")

    res.redirect(`/listings/${listing._id}`); //not match as  mentors projects (`/listings/${listing._id}`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}) //reviews array me jis bhi review se  reviewid match kar jaaye hum us id pull krna chchte hai 
    await Review.findById(reviewId);
    req.flash("success", "Review Deleted")

    res.redirect(`/listings/${id}`);
};