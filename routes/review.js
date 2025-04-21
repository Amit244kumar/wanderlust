const express=require("express")
const router=express.Router({mergeParams:true})
const wrapAsync=require("../utils/wrapAsync")

const ExpressError=require("../utils/ExpressError")
// const Listing=require('../models/Listing')
// const Review=require('../models/reviews')
const reviewSChema=require("../schema")
const isLoggedIn=require('../middleware')

const isReviewAuthor=require("../middleware")
const reviewController=require("../controller/reviews")

const validateReview=(req,res,next)=>{
    const {error}=reviewSChema.validate(req.body)
    if(error){
        throw new ExpressError(404,error)
    }else{
        next()
    }
}

router.post("/",isLoggedIn,wrapAsync(reviewController.createReview))

router.delete("/:reviewId",isReviewAuthor,isLoggedIn,wrapAsync(
   reviewController.deleteReview
))

module.exports=router