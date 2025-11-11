const express = require("express");
const app = express();
require('dotenv').config();

// Opencage-Api
const Api = require("./public/js/ApiCalls.js")

// inRadi function which returns collection of {doctors} jinki jinki service range me paitient ata hai 
const {inRadi} = require("./public/js/inRadius.js")


// for basic ejs only-->
const path = require("path");   
app.set("view engine" ,"ejs")
app.set("views" , path.join(__dirname , "views"));

// for ejs-Mate(Boilerplate)
const ejsMate = require("ejs-mate")
app.engine("ejs" , ejsMate);



//  CUSTOM ERROR HANDLER
const ExpressError = require("./ErrorHandler/ExpressError.js")
const WrapAsync =require("./ErrorHandler/WrapAsync.js");

//COOKIES
const cookieParser = require("cookie-parser")
app.use(cookieParser("secretcode"));

// EXPRESS SESSIONS
const session = require('express-session')

// USING (CONNECT-FLASH )TO DISPLAY ANYTHING ADDED AUR CREATED AS A FLASH FOR ONE TIME
const flash = require('connect-flash');
app.use(flash()); 


// PASSPORT AUTHENTICATION
const passport =require("passport")
const LocalStrategy = require("passport-local")

// to Serve Static files(can leave also )
app.use(express.static(path.join(__dirname, "public")));

//FOR MONGOOSE CONNECT TO NODE.JS AND DB
const mongoose = require('mongoose'); 
// app.use(express.json()); C USE KAR RHA
app.use(express.urlencoded({ extended: true }));          //form se bheje gaye data ko read karna aur usse JavaScript object 
// const DB_URL ="mongodb://127.0.0.1:27017/GaonCare"
const deployed_Db_Url = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(deployed_Db_Url);  //   changed   DB_URL  to -->  deployed_Db_Url
}

main()
  .then(() => {
    console.log("connected to DB"); 
  })
  .catch((err) => {
    console.log(err);
  });


//USER MODEL
const User = require("./Models/User.js");
const { isUserLoggedIn } = require("./middleware.js");

//DOCTOR MODEL
const Doctor = require("./Models/Doctor.js");

//BOOKING MODEL
const Booking = require("./Models/Booking.js")


app.listen(8080, () => {
  console.log("server is listening to port 8080 type    http://localhost:8080/GaonCare");
});



//sessions

const sessionOptions= {
secret : "secretcode",
resave :false , 
saveUninitialized : true ,

cookie :{
  expires : Date.now() + 7*24*60*60*1000 ,       // 7 din bad login expire ho jayga aur cookie delete ho jaygi
  maxAge : 7*24*60*60*1000 ,
  httpOnly : true
}
}
app.use(session(sessionOptions));
// USING AUTHENTICATION BY PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.use((req, res, next)=>{
//   res.locals.success = req.flash("success")
//   res.locals.error = req.flash("error")
//   next();
// })


//ab har route ke liye ek session id create hoke cookie me save ho jaygi 

app.use((req, res, next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});



app.get("/GaonCare" , (req , res)=>{
    res.render("./index.ejs")
})



app.post("/userSignup" , async(req, res)=>{
    let password=req.body.user.password
    let newUser = new User({...req.body.user});
    let location = req.body.user.location
    newUser.coordinates =await Api(location);
    let registeredUser = await User.register(newUser , password);
    console.log(registeredUser);
    req.login(registeredUser , ((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "Welcome   to GaonCare !You Are Registered and LoggedIn ");
            res.redirect("/GaonCare");
      }));
    
})


app.post("/loginUser" ,passport.authenticate('local', { failureRedirect: '/Gaoncare',failureFlash : true }),
 (req , res)=>{
  req.flash("success","You Are LoggedIn !")
  res.redirect("./GaonCare")
})


app.post("/doctorSignup" , async(req , res)=>{
    let password=req.body.doctor.password
    const newDoctor = new Doctor({...req.body.doctor})
    console.log(newDoctor)
     let location = req.body.doctor.location
    newDoctor.coordinates = await Api(location);
    let registeredDoctor = await Doctor.register(newDoctor , password)
    console.log(registeredDoctor)
    req.login(registeredDoctor , ((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success" , "New Doctor Registered And LoggedIn !");
            res.redirect("/GaonCare");
      }))
})




app.get("/signoutUser" , (req, res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success" , "Your Are LoggedOut !")
    res.redirect("./GaonCare")
  })
})

// EMERGENCY BOOKING

app.get("/Emergency" ,isUserLoggedIn, async(req, res)=>{
  let allDoctors = await Doctor.find({});
  res.render("./Emergency.ejs",{allDoctors} ,nearbyDoctors=false)
})



app.get("/nearbyDoctor" , async(req , res)=>{
  const currUser=req.user
  let allDoctors = await Doctor.find({});
  const nearbyDoctors = allDoctors.filter((el)=>{
    // console.log({latitude:currUser.coordinates.lat ,longitude: currUser.coordinates.lng })
    return inRadi(  //isPointWithinRadius?  //doctor is center point

//returns collection of {doctors} jinki jinki service range me paitient ata hai 
      {latitude:currUser.coordinates.lat ,longitude: currUser.coordinates.lng },
      {latitude :el.coordinates.lat , longitude : el.coordinates.lng},
      el.serviceRange
    )
  })
  console.log(nearbyDoctors)
  res.render("./Emergency" , {nearbyDoctors})
})


app.get("/EBookingForm/:id" , async(req,res)=>{
 const docId = req.params.id;
  let doc = await Doctor.findById(docId)
  res.render("./Booking/EBookingForm.ejs" ,{doc})
})


app.post("/conEBooking/:id" , async(req,res)=>{
  const docId = req.params;
  console.log(docId);
  const currUserLat = req.user.coordinates.lat;
  const currUserLng = req.user.coordinates.lng;
  const currUserId = req.user.id;

  const newBooking = new Booking({
    patient:currUserId,
    doctor:docId,
    location:{lat:currUserLat , lng :currUserLng}
  })
  await newBooking.save();
  console.log(newBooking)
  console.log(" NewBooking Created")
  req.flash("success" ,`Emergency Booking request sent! Check in My Booking Section`)
  res.redirect("/GaonCare")
})

// Toggle availability (PATCH) for doctor is available or not 

app.patch("/doctor/:id/toggleAvailability", async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await Doctor.findById(id);
    if (!doc) return res.status(404).send("Doctor not found");
    doc.isAvailable = !doc.isAvailable; // toggle
    await doc.save();
    res.json({ id: doc._id, isAvailable: doc.isAvailable });
  } catch (err) {
    next(err);
  }
});




// for Asha Dashboard
 app.get("/Asha" , (req, res)=>{
   res.render("./AshaDashboard.ejs");
 })



//Express ka error-handling middleware
app.use((err , req , res , next)=>{
  console.log(err.message)
  let {status=500 , message="Koi Msg nahi aya err me "}= err;
  // res.send(err)
  res.status(status).send(message)
})

