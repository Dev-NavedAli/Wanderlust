const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }) ;   //Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.

//yha multer form ke data se files ko nikalega or unhe uploads naam ke or automatically uploads naam ka folder or us uplaods naam ke folder ke andar files ko stor karayega 


router
    .route("/")
        .get(wrapAsync(listingController.index))
    .post(                                   //index and create === route ke path same the isiliye inhe or efficient tarike se likhne ke liye we use router.route ka use kia hai
        isLoggedIn,
        // validateListing,
        upload.single('listing[image]') ,
        wrapAsync(listingController.createListing)
    )

// NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        validateListing,
        wrapAsync(listingController.updateListing)   //show , update and delete routes
    )
    .delete(
        isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

// EDIT ROUTE
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;