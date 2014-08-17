(function (auth) {

    var data = require("../data");
    var hasher = require("./hasher");

    auth.init = function (app) {

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