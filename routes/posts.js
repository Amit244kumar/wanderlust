const express=require("express")
const router=express.Router()



// post
router.get('/',(req,res)=>{
    res.send("i am get res")
})
// /users/:id
router.get('/:id',(req,res)=>{
    res.send("i am get res with id")
})
//show- use
router.post('/',(req,res)=>{
    res.send("i am post res")
})

router.delete('/',(req,res)=>{
    res.send("i am delete res")
})

module.exports=router