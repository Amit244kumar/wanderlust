const Listing=require("./models/Listing")
const reviews = require("./models/reviews")

module.exports=isLoggedIn=(req,res,next)=>{
    console.log(req.path,"..",req.originalUrl)
    if(!req.isAuthenticated()){
        //redirectUrl
        req.session.redirectUrl=req.originalUrl
        req.flash("error","you must be logged in to create listing")
        res.redirect("/login")
    }
    next()
}

module.exports.savaRedirectUrl=(req,res,next)=>{
    console.log("savaRedirectUrl")
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    console.log(res.locals.redirectUrl)
    next()  // Ensure next() is called after logging
}
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params
    let listing=await Listing.findById(id)
    if(!listing.owner.equals(res.locals.curUser._id)){
        req.flash("error","you are not the author of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params
    let review=await reviews.findById(reviewId)
    if(!review.author.equals(res.locals.curUser._id)){
        req.flash("error","you are not the owner of this review")
        return  res.redirect(`/listings/${id}`)
    
    }
    next()
}