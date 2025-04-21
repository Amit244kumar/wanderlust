const Listing=require('../models/Listing')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN
const geocodingClient=mbxGeocoding({accessToken:mapToken})
module.exports.index=async(req,res)=>{
   
    const allListing=await Listing.find({})
    res.render("Listings/index.ejs",{allListing})
}

module.exports.create=(req,res)=>{
    res.render('listings/new.ejs')
}

module.exports.showListing=async(req,res)=>{
    const {id}=req.params
    const listing=await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner")
    .populate()
    console.log(listing)
    if(!listing){
        req.flash("error",'Listing you requested for does not existed')
    }
    res.render('Listings/show.ejs',{listing})
}

module.exports.createListing=async(req,res)=>{
    console.log(req.body.listing.location)
    let response=await geocodingClient.forwardGeocode({
        query:req.body.listing.location,
        limit:2
    })
    .send()

    const {filename,path}=req.file;
    console.log(filename,".....",path)
    const listing=new Listing({...req.body.listing})
    listing.owner=req.user._id
    listing.image.filename=filename
    listing.image.url=path
    listing.geometry=response.body.features[0].geometry
   
    const t= await listing.save()
    console.log(t)
    req.flash("success",'listing created successfully')
    res.redirect(`/listings/${listing._id}`)
}

module.exports.editListing=async(req,res)=>{
    let {id}=req.params
    const listing=await Listing.findById(id) 
    if(!listing){
        req.flash("error",'Listing you requested for does not existed')
        return res.redirect('/listings');
    
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("Listings/edit.ejs",{listing,originalImageUrl})
}

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params
  
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing})
    if(typeof req.file !== 'undefined'){
        const {filename,path}=req.file;
        listing.image.filename=filename
        listing.image.url=path
        await listing.save()
    }
    req.flash("success",'listing updated!')
    if(!Listing){
        req.flash("error",'Listing you requested for does not existed')
    }
    res.redirect(`/listings/${id}`)
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params
    await Listing.findByIdAndDelete(id)
    req.flash("success",'listing deleted!')
    res.redirect('/listings')
}