(function (auth) {

    var data = require("../data");
    var hasher = require("./hasher");
    var passport = require("passport");
    var localStrategy = require("passport-local").Strategy;

    function userVerify(username, password, next) {
        data.getUser(username, function (err, user) {
            if(!err && user) {
                var currentHash = hasher.computeHash(password, user.salt);
                if(currentHash === user.passwordHash){
                    next(null, user);
                    return;
                }
            }

            next(null, false, {messge: "Invalid credentials"});
        });
    }

    auth.init = function (app) {

        // setup passport authentication
        passport.use(new localStrategy(userVerify));
        passport.serializeUser(function (user, next) {
            next(null, user.username);
        });
        passport.deserializeUser(function (key, next) {
            data.getUser(key, function (err, user) {
                if(err) next(null, false, {message: "Error to retrieve user"});
                else next(null, user);
            })
        });
        app.use(passport.initialize());
        app.use(passport.session());


        auth.ensureAuthenticated = function(req, res, next){
            "use strict";
            if(req.isAuthenticated()) {
                next();
            } else {
                res.redirect("/login");
            }
        };

        auth.ensureApiAuthenticated = function (req, res, next) {
            if(req.isAuthenticated()) {
                next();
            } else {
                res.status(401).send("Not authorized");
            }
        };

        app.get("/login", function (req, res) {
            res.render("login", {title: "Login to the Board", message: req.flash("loginError") });
        });

        app.post("/login", function(req, res, next) {
            var authFunction = passport.authenticate("local", function (err, user, info) {
                if(err) next(err);
                else {
                    req.logIn(user, function (err) {
                        if(err) next(err);
                        else res.redirect("/");
                    });
                }
            });
            authFunction(req, res, next);
        });


        app.get("/register", function (req, res) {
            res.render("register", {title: "Register to the Board", message: req.flash("registrationError")  });
        });

        app.post("/register", function (req, res) {

            var salt = hasher.createSalt();

            var user = {
                name: req.body.name,
                email: req.body.email,
                username: req.body.username,
                passwordHash: hasher.computeHash(req.body.password, salt),
                salt: salt
            };

            data.addUser(user, function (err) {
                if(err) {
                    res.flash("registrationError", "Something wrong with registering new user");
                    res.redirect("/register");
                } else {
                    res.redirect("/login");
                }
            });
        });

    };

})(module.exports);