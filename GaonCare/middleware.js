

    module.exports.isUserLoggedIn = (req, res, next)=>{
        if(!req.isAuthenticated()){
            req.flash("error" , "Login First to access instant Booking !")
        return res.redirect("/GaonCare")
        }
        next();
    }