const express=require("express")
const app=express()
// const users=require("../routes/users")
// const posts=require('../routes/posts')
// const cookieParser=require("cookie-parser")
const flash=require("connect-flash")
const session=require("express-session")
const path=require("path")
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"views"))

app.use(flash())
app.use(session(
    {
        secret:"mysupersecretstring",
        resave:false,
        saveUninitialized:true
    }
));
app.use((req,res,next)=>{
    res.locals.successMessage=req.flash('success')
    res.locals.errorMessage=req.flash('error')
    next()
})

app.get('/register',(req,res)=>{
    let {name="anonymous"}=req.query
    req.session.name=name
    if(name==='anonymous'){
        req.flash("error","user is not register")
    }else{
        req.flash('success',"user register successfully")
    }
    res.redirect('/hello')  
})

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name})
})

// app.get("/reqcout",(req,res)=>{
//     if(req.session.count){
//         req.session.count++
//     }else{
//         req.session.count=1;
//     }
//     res.send(`you send the request ${req.session.count} time`)
// })
// app.get("/test",(req,res)=>{
//     res.send("test successfull")
// })

app.listen(8000,()=>{
    console.log("server is listening to 8000")
})

// app.use(cookieParser("secretcode"))

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("made-in","india",{signed:true})
//     res.send("signed cookie set")
// })

// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies)
//     res.send("verify")
// })
// app.get("/hello",(req,res)=>{
//     let {name="anonymous"}=req.cookies
//     res.send(`hi,${name}`)
// })
// app.get("/setcookies",(req,res)=>{
//     res.cookie("greet","hello")
//     res.send("sent you some cookies:")
// })
// app.get("/",(req,res)=>{
//     console.dir(req.cookies)
//     res.send("i am root")
// })
// app.use("/users",users)
// app.use("/posts",posts)
