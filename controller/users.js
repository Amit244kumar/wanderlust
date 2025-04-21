const passport=require('passport')
const User=require("../models/User")

module.exports.signupPage=(req,res)=>{
    res.render('users/signup.ejs')
}

module.exports.signup=async(req,res)=>{
    try {
        let {username,email,password}=req.body
        const newUser=new User({username,email,password})
        const registerUser=await User.register(newUser,password)
        console.log(registerUser)
        req.login(registerUser,(err)=>{
            if(err){
                return next(err)
            }
            req.flash("success","welcome to wanderlust")
            res.redirect("/listings");
        })
    } catch (error) {
        console.log(error)
        req.flash('error',error.message)
        res.redirect('/signup')
    }
}
module.exports.loginPage=(req,res)=>{
    res.render('users/login.ejs')
}

module.exports.login=(req, res, next) => {
    console.log("Login attempt");
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        
        return next(err);
      }
      if (!user) {
        req.flash("error", "Invalid username or password");
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome back to Wanderlust!");
        return res.redirect("/listings");
      });
      console.log("User authenticated:", user);
    })(req, res, next);
  }


module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","you are logout now")
        res.redirect("/login")
    })
}