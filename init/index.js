const mongoose =require("mongoose")
const initData=require("./data.js")
const Listing=  require("../models/Listing.js")


main().then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err)
})
async function main(){
    await mongoose.connect('mongodb+srv://bank22kumar:yZ7Re6gNdDk535ks@cluster0.ezmfz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
}

const initDB=async()=>{
    await Listing.deleteMany({})
    initData.data=initData.data.map((obj)=>({...obj,owner:"67fb7da9a9dbb9bf6c0fb40a"}))
    await Listing.insertMany(initData.data)
    console.log("database initialise")
}

initDB()