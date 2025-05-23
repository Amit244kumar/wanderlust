
if(process.env.NODE_ENV !== "production") { 
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const ExpressError = require("./utils/ExpressError");
const reviewSChema = require("./schema");
const listingRouter = require("./routes/listing");
const reviewsRouter = require("./routes/review");
const userRouter = require("./routes/users");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/User");




app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store=MongoStore.create({
  mongoUrl:process.env.MONGODB_URL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600
})
store.on("error",()=>{
  console.log("error in mongo session store")
})

const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// passport.use(new localStrategy(User.authenticate))
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const validateReview = (req, res, next) => {
  const { error } = reviewSChema.validate(req.body);
  if (error) {
    throw new ExpressError(404, error);
  } else {
    next();
  }
};

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curUser = req.user;
  next();
});

// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         email:'amit244am@gmail.com',
//         username:"delta student",
//     })
//     const newUser=await User.register(fakeUser,'helloworld')
//     res.send(newUser)
// })
app.get('/',(req,res)=>{
  res.redirect('/listings')
})
app.use("/listings", listingRouter);
app.use("/listings/:id/review+", reviewsRouter);
app.use("/", userRouter);
// app.get("/",(req,res)=>{
//     res.send("hi, i am root")
// })

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
  let { status, message } = err;
  res.render("error.ejs", { err });
  // res.status(status).send(message)
});

app.listen(3000, () => {
  console.log("port listening to port 3000");
});