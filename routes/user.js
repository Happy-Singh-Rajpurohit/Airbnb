const express = require("express");
const app = express();
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectURL } = require("../middleware.js");


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));


router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});


router.post("/login", saveRedirectURL , passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    flash = req.flash("success", "Welcome back to Wanderlust!");
    let redirectURL = res.locals.redirectURL || "/listings";
    res.redirect(redirectURL);
});

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged you out!");
        res.redirect("/listings");
    });
});

module.exports = router;