const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudeConfig.js")
const upload = multer({ storage })

const listingController = require("../controllers/listings.js");

router
 .route("/")
.get(listingController.index)
.post( isLoggedIn, upload.single('listing[image]'), listingController.creatListing)

//New route
router.get("/new",isLoggedIn,listingController.renderNewForm)

router.route("/:id")
.get(listingController.showListing)
.put(isLoggedIn,isOwner, upload.single('listing[image]'), listingController.updateListing)
.delete(isLoggedIn,isOwner, listingController.destroyListing)

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,listingController.renderEditForm)

module.exports = router