const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware.js");

const reviewControllers = require("../controllers/review.js");

//Reviews
//Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.createReviews));

//Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewControllers.destroyReview));

module.exports = router;