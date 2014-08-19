/**
 * Created by Maksym on 14-Aug-14.
 */
(function (notesController) {
    notesController.init = function (app) {

        var data = require("../data");
        var auth = require("../auth");

        app.get("/api/notes/:categoryName",
            auth.ensureApiAuthenticated,
            function (req, res) {

                var categoryName = req.params.categoryName;

                data.getNotes(categoryName, function (err, notes) {
                    if(err){
                        res.status(400).send(err);
                    } else {
                        res.set("Content-Type", "application/json");
                        res.status(200).send(notes.notes);
                    }
            })

        });

        app.post("/api/notes/:categoryName",
            auth.ensureApiAuthenticated,
            function (req, res) {

                var categoryName = req.params.categoryName;

                var noteToInsert = {
                    name: req.body.note,
                    color: req.body.color,
                    author: "Max"
                };

                console.log("noteToInsert: " + noteToInsert);

                data.addNote(categoryName, noteToInsert, function (err) {
                    if(err){
                        res.status(400).send("Failed to insert note to data store: " + err);
                    } else {
                        res.set("Content-Type", "application/json");
                        res.status(201).send(noteToInsert);
                    }
            })

        });

    }
})(module.exports);