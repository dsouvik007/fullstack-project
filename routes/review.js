const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviews.js");
const { isLoggedIn, validateReview, isAuthor } = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");

//validation of reviews
router.post("/", 
    isLoggedIn,
    validateReview,
    wrapAsync(reviewcontroller.validatereview));

//deletion of reviews
router.delete("/:reviewId", 
    isLoggedIn, 
    isAuthor,
    wrapAsync(reviewcontroller.deletereview));

module.exports = router;