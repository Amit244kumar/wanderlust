// const Listing = require('../models/listing')
// const Review = require('../models/reviews')
const Listing=require('../models/Listing')
const Review=require('../models/reviews')
module.exports.createReview = async(req,res)=>{
    let listing=await Listing.findById(req.params.id).populate("reviews")
    console.log(listing)
   
    let review=new Review(req.body.review)
    review.autor=req.user._id   
    listing.reviews.push(review)
    console.log(review)
    await review.save() 
    await listing.save() 
    req.flash("success",'new Review created') 
    res.render('Listings/show.ejs',{listing}) 

}

module.exports.deleteReview=async(req,res)=>{
    let {id,reviewId}=req.params
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash("success","Review deleted")
    res.redirect(`/listings/${id}`) 
}

