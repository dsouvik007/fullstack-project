if (process.env.NODE_ENV != "PRODUCTION") {
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ExpressError = require("./utils/ExpressError.js");
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// mongo_url = 'mongodb://127.0.0.1:27017/wonderlust';
const db_url = process.env.ATLASDB_URL;

main()
    .then((res) => {
        console.log("connection successull");
    }).catch((err) => {
        console.log(err)
    });

    async function main() {
        await mongoose.connect(db_url);
    }

    app.engine('ejs', ejsMate);
    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "views"));
    app.use(methodOverride('_method'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "/public")));

    const store = MongoStore.create({
        mongoUrl : db_url,
        crypto:{
            secret : process.env.SECRET
        },
        touchAfter: 24*3600,
    });
    
    store.on("error", ()=>{
        console.log("error in session store", err);
    })
    
    const sessionInfo = {
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httponly : true
        }
    }
    app.use(session(sessionInfo));
    app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


//index route
// app.get("/", (req, res) => {
//     res.send("hi, i am root");
// });



// app.get("/demouser", (async(req,res)=>{
//     let fakeUser = new User({
//         email: "student123@getMaxListeners.com",
//         username: "demonUser",
//     });
//     let newUser = await User.register(fakeUser, "helloworld");
//     res.send(newUser);
// }));

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("", userRouter)

// app.get("/testListing", async(req,res)=>{
//     let sampleListing = new Listing({
//         tittle:"new villa",
//         description:"by the ocean",
//         price:1000,
//         location:"Goa",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("sample data saved");
//     res.send("successfull");
// });

app.all("*", (req, res, next) => {
    next(new ExpressError(400, "Page Not Found !"));
});

app.use((err, req, res, next) => {
    let { statuscode = 500, message = "something went wrong" } = err;
    res.status(statuscode).render("listings/error.ejs", { message });
});

// app.use((err,req,res,next)=>{
//     res.send("something went wrong");
// })
app.listen("8080", () => {
    console.log("app is listening");
});