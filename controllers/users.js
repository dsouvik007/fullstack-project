const User = require("../models/user.js");

module.exports.signuprender=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup =(async(req,res,next)=>{
    try{
        let{username, email, password} = req.body;
        const newUser = new User({email, username});
        const regUser = await User.register(newUser, password);
        console.log(regUser);
        req.login(regUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "welcome to wonderlust"),
            res.redirect("/listings")
        });  
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    await req.flash("success", "welcome back!")
    let finalredirect = res.locals.redirectUrl || "/listings";
    res.redirect(finalredirect);
}

module.exports.logout =(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        };

        req.flash("success", "logged out");
        res.redirect("/listings");
    });
}