const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

router
    .route("/")
        .get(wrapAsync(listingController.index))
    .post(                                   //index or create route ke path same the isiliye inhe or efficient      tarike se likhne ke liye we use router.route 
        isLoggedIn,
        validateListing,
        wrapAsync(listingController.createListing)
    );



// NEW ROUTE
router.get("/new", isLoggedIn, listingController.renderNewForm);

// SHOW ROUTE
router.get("/:id", wrapAsync(listingController.showListing));

// EDIT ROUTE
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

// UPDATE ROUTE
router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing)
);

//DELETE ROUTE
router.delete(
    "/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
);

module.exports = router;
