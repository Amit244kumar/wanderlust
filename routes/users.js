
const express=require("express")
const router=express.Router({mergeParams:true})

const wrapAsync = require("../utils/wrapAsync")

const userController=require("../controller/users")

router.route('/signup')
    .get(userController.signupPage)
    .post(wrapAsync(userController.signup))
// router.get('/signup',userController.signupPage)

// router.post('/signup',wrapAsync(userController.signup))


router.route('/login')
    .get(userController.loginPage)
    .post(userController.login)


// router.get("/login",wrapAsync(userController.loginPage))
// router.post("/login",userController.login);


router.get("/logout",userController.logout)

module.exports=router
