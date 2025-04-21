const express=require("express")
const router=express.Router()
const wrapAsync=require("../utils/wrapAsync")
const listingSchema=require("../schema")
const ExpressError=require("../utils/ExpressError")

const isLoggedIn=require('../middleware')
const isOwner=require("../middleware")
const multer = require("multer");
const { storage } = require("../cloudConfig")
const upload = multer({storage});

const listingController=require("../controller/listings")

const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body)

    if(error){
        throw new ExpressError(404,error)
    }else{
        next()
    }
}

//add new listing 
router.get('/new',isLoggedIn,listingController.create) 

router.route("/")
        .get(wrapAsync(listingController.index))
        .post(
            isLoggedIn,
            isOwner,
            // validateListing,
            upload.single('listing[image]'),
            wrapAsync(listingController.createListing)
        );
        
router.route("/:id")
        .put(isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
        .get(wrapAsync(listingController.showListing))
        .delete(isLoggedIn,isOwner,wrapAsync(listingController.deleteListing))





//showing particular lsiting data
// router.get("/:id",wrapAsync(listingController.showListing))



// router.post('/',isLoggedIn,isOwner,validateListing,
//     wrapAsync(listingController.createListing))


router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editListing))


// router.put('/:id',isLoggedIn,isOwner,wrapAsync(listingController.updateListing))

// router.delete('/:id',isLoggedIn,isOwner,wrapAsync(listingController.deleteListing)) 


module.exports=router