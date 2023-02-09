const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors")
const appartement = require("./app/controller/appartement.controller");
const app = express();
const mustacheExpress = require("mustache-express")
const favicon = require('serve-favicon');

// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.options("*", cors());
app.engine("html", mustacheExpress())
app.set("view engine", "html")
app.set("views", __dirname + "/views")
app.use(express.static('public'));
app.use(favicon(__dirname + "/public/img/favicon.ico"));

// list all the appartements
app.get("/", (req, res) => {
    res.render("home", {});
});
app.get("/appartements/", appartement.findAll);
// show the add suppler form
app.get("/appartement-add", (req, res) => {
    res.render("appartement-add", {});
});
// receive the add appartement POST
app.post("/appartement-add", appartement.create);
// show the update form
app.get("/appartement-update/:id", appartement.findOne);
// receive the update POST
app.post("/appartement-update", appartement.update);
// receive the POST to delete a appartement
app.post("/appartement-remove/:id", appartement.remove);
// handle 404
app.use(function (req, res, next) {
    res.status(404).render("404", {});
})


// set port, listen for requests
const app_port = process.env.APP_PORT || 3000
app.listen(app_port, () => {
    console.log(`Server is running on port ${app_port}.`);
});