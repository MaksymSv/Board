var http = require("http");
var express = require("express");
var bodyParser = require("body-parser");
var controllers = require("./controllers");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var flash = require("connect-flash");
var auth = require("./auth");


var app = express();

// init view engine
app.set("view engine", "vash");

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({secret: "SomeKeyPhraseWillWorkHere", saveUninitialized: true, resave: true }));
app.use(flash());

auth.init(app);

// into routing
controllers.init(app);

var server = http.createServer(app);
server.listen(3000);

var updater = require("./updater");
updater.init(server);