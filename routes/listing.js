const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");



//Index Route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//New Route
router.get("/new", isLoggedIn, (req, res) => {
    console.log(req.user);
    res.render("listings/new.ejs");
});

//Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    console.log(listing);
    if(!listing){
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {

    const listingData = req.body.listing;
    // Check if image.url is missing or empty, and set default manually
    if (!listingData.image || !listingData.image.url || listingData.image.url.trim() === "") {
        listingData.image = {
            url: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
        };
    }

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing!");
    return res.redirect("/listings");
})
);


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Cannot find that listing!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing,  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted a listing!");
    res.redirect("/listings");
}));

module.exports = router;