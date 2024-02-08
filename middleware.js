const Listing = require("./models/listing")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; //req.originalUrl ki value req.session.redirectUrl me save karaynge
        req.flash("error","you must be logged in create listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl =  (req,res,next)=>{     //ye ek or middleware banayenge taaki hum redirect url ki value local me save kra sake bcuz passport hume directly access nhi krne deta redirectUrl ko isiliye hum ise res.locals me save karyenge or isi ko login me use karenge
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`)
    }
    next();
}


module.exports.validateListing = (req,res,next) =>{
    let {error}= listingSchema.validate(req.body);
    if (error){
    let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) =>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
};

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {  id , reviewId } = req.params;   //show page pe redirect hone ke liye hamare pass id bhi honii chhiye isliye yha hmne id bhi lkhi hai
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not the author of this  review");
        return res.redirect(`/listings/${id}`)
    }
    next();
}
