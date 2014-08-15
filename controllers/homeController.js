(function(homeController){
	homeController.init = function(app){
	
		var data = require("../data");

		app.get("/", function(req, res) {
			
			data.getNoteCategories(function(err, results){
				res.render(
                    "index",
                    {
                        title : "Express + Vash",
                        error: err,
                        categories: results,
                        newCatError: "get from res.flash" //res.flash("newCatName")
                    });
			});
		
			
		});

        app.get("/notes/:categoryName", function (req, res) {
            var categoryName = req.params.categoryName;
            res.render("notes", {title: categoryName});
        });

        app.post("/newCategory", function (req, res) {
            var categoryName = req.body.categoryName;
            data.createNewCategory(categoryName, function (err) {
                if(err) {
                    // handle error
                    console.log(err);
                    //res.flash("newCatName", err);

                    res.redirect("/");
                } else {

                    res.redirect("/notes/" + categoryName);
                }
            });
        });

		// app.get("/api/users", function(req, res) {
		// 	res.set("Content-Type", "application/json");
		// 	res.send({name : "user 1", age: 25});
		// });

	};
})(module.exports);