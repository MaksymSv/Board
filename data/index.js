(function(data){

	var seedData = require("./seedData");
    var database = require("./database");

	data.getNoteCategories = function(next){
		//next(null, seedData.initialNotes);
        database.getDb(function (err, db) {
            if(err) next(err, null);
            else {
                db.notes.find().sort({name: -1}).toArray(function (err, results) {
                    if(err) next(err, null);
                    else next(null, results);
                });
            }
        });
	};

    data.createNewCategory = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) next(err, null);
            else {
                db.notes.find({name: categoryName}).count(function (err, count) {
                    if(err) next(err, null);
                    else {
                        if(count != 0) next("Category already exists", null);
                        else {

                            var cat = {
                                name: categoryName,
                                notes: []
                            };
                            db.notes.insert(cat, function (err) {
                                if (err) next(err, null);
                                else next(null);
                            });
                        }
                    }
                });
            }
        });
    };
        
    data.getNotes = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) next(err, null);
            else {
                db.notes.findOne({name: categoryName}, next);
            }
        });
    };

    
    data.addNote = function (categoryName, noteToInsert, next) {
        database.getDb(function (err, db) {
            if (err) next(err);
            else {
                db.notes.update( // update
                    {name: categoryName},
                    { $push: {notes: noteToInsert} },
                    next);
            }
        });
    };

    data.addUser = function (user, next) {
        database.getDb(function (err, db) {
            if (err) next(err);
            else {
                db.users.insert(user, next);
            }
        });
    };

    data.getUser = function (username, next) {
        database.getDb(function (err, db) {
            if (err) next(err);
            else {
                db.users.findOne({username: username }, next);
            }
        });
    };

    function seedDatabase() {
        database.getDb(function(err, db){
            if(err) {
                console.log("Failed to seed database: " + err);
            } else {
                // check if DB is already seeded
                db.notes.count(function (err, count) {
                    if(err){
                        console.log("Failed to get notes count from DB: " + err);
                    } else {
                        if(count == 0) {
                            console.log("Seeding database...");
                            seedData.initialNotes.forEach(function (item) {
                                db.notes.insert(item, function (err) {
                                   if(err) console.log("failed to insert note in DB: " + err);
                                });
                            });
                            console.log("Done.");
                        } else {
                            console.log("Database already seeded.");
                        }
                    }
                    
                });
            }
        });
    }

    seedDatabase();
})(module.exports);