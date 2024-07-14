const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>
{
    
    let listing =await Listing.findById(req.params.id);
    console.log(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.review.push(newReview);
    //listing.review.push(newReview.rating);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
   
}

module.exports.deleteReview = async(req,res)=>
{
    try{
       
        let id= req.params.id;
        let reviewId = req.params.reviewID;
        await Listing.findByIdAndUpdate(id, {$pull: {review: reviewId}});
        // await Listing.review.pop(reviewId);
        //console.log(await Listing);
       await Review.findByIdAndDelete(reviewId)
       req.flash("success","List deleted!");
        res.redirect(`/listings/${id}`);
    }
    catch(err)
    {
        res.send("something wrong");
       // res.render("error.ejs")
    }
}