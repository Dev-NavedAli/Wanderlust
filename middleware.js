const Listing = require("./models/listing")

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