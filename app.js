//declaring modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const database = require(__dirname + "/db.js");
const toDoListDB = "mongodb://localhost:27017/toDoListDB";

//setting up express and its uses
const app = express();
app.set("view engine", "ejs"); //view engine for templating
app.use(bodyParser.urlencoded({extended: true})); //enabeling parsing of body from a request (espially for post methods)
app.use(express.static("public")); //defining folder for static files to be served by express

//const listItems = database.getAllItems(toDoListDB);
const listItems= [];
console.log(listItems);

function openConnection() {
    mongoose.connect(toDoListDB);
}

function closeConnection() {
    mongoose.connection.close();
}

app.get("/", (req, res) => {
    res.render("list", {
        listTitle: date.getDate(),
        listItems: listItems,
    });
});

app.post("/", (req, res) => {
    database.addItem(req.body.newItem, toDoListDB);
    listItems.push(req.body.newItem);
    res.redirect("/");
});

app.get("/work", (req, res) => {
    // res.render("list", {|
    //   listTitle: "Work",
    //   listItems: workItems,
    // });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen("3000", () => {
    console.log("Server running");
});