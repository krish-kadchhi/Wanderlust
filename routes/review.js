const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {revieSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js")
//Reviews
//post route
router.post("/",reviewController.createReview)

//delete route
router.delete ("/:reviewID",isLoggedIn,reviewController.deleteReview)
module.exports=router;