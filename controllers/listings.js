const Listing = require("../models/listing.js");


module.exports.index = async (req, res,next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",     // yha pr hmm nested populate kr rhe hai taki reviews ke sath sath uske auhor ko bhi dikha sakien
            populate: {
                path: "author",
            }
            ,
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}

module.exports.createListing = async (req, res, next) => {
    let {location} = req.body.listing;

    const data = await fetch("https://geocode.maps.co/search?q="+location.split(", ").join("+")+"&api_key=668cdc66180b5425798827zyxafe37a")
    const json = await data.json();
    let {lon, lat} = json[0];

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;  //req.user me curr user ki id req.user._id me save hoti hai jisko passport by default save karata hai or is line se hum ye bata rahe hai jo hmara newListing ka owner ho uske andar currrent user ki hi id store ho
    newListing.image = { url, filename };

    newListing.geometry ={type: 'Point', coordinates: [lon, lat]}; //accesing the coordinates which we give in to add new listing with the help of geocoding

    let savedListing = await newListing.save();
    console.log(savedListing);  
    req.flash("success", "New Listing Created!")
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    };

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250") //inki help se edit.ejs me jo photo aara hai uska size or blurryness aajayegi or size bhi kam hoga 

    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;             //isme agar req.file ki value undefined rahi to ye code execute nhi hoga
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", " Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
}

module.exports.index = async (req, res,next) => {
    const {query} = req.query;
    let allListings;
    if(query){
        allListings = await Listing.find({
            title: { $regex: query, $options: "i" }
        });
    }else{
        allListings = await Listing.find({});
    }
    

    
    res.render("listings/index.ejs", { allListings });
};

