/**
 * Created by Maksym on 14-Aug-14.
 */
(function (notesController) {
    notesController.init = function (app) {

        var data = require("../data");


        app.get("/api/notes/:categoryName", function (req, res) {

            var categoryName = req.params.categoryName;

            data.getNotes(categoryName, function (err, notes) {
                if(err){
                    res.send(400, err);
                } else {
                    res.set("Content-Type", "application/json");
                    res.send(200, notes.notes);
                }
            })

        });

        app.post("/api/notes/:categoryName", function (req, res) {

            var categoryName = req.params.categoryName;

            var noteToInsert = {
                name: req.body.note,
                color: req.body.color,
                author: "Max"
            };

            data.addNote(categoryName, noteToInsert, function (err) {
                if(err){
                    res.send(400, "Failed to insert note to data store: " + err);
                } else {
                    res.set("Content-Type", "application/json");
                    res.send(201, noteToInsert);
                }
            })

        });

    }
})(module.exports);