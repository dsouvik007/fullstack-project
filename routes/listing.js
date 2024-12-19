const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });


router.route("/")
//just creating the a route to show the headings and adding anchore tag to get a gte req
.get(wrapAsync(listingController.index))
    // create route
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.create));



//step 3 we will send a get req where we will create a ajs form to submit the details
router.get("/new",
    isLoggedIn,(listingController.renderNewlistings));

router.route("/:id")
//show route
.get(wrapAsync(listingController.show))
// updateroute
.put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateRoute))
// delete route
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroy));

// edit route
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.edit));


module.exports = router;