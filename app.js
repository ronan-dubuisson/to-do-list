//declaring modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");

//setting up express and its uses
const app = express();
app.set("view engine", "ejs"); //view engine for templating
app.use(bodyParser.urlencoded({ extended: true })); //enabeling parsing of body from a request (espially for post methods)
app.use(express.static("public")); //defining folder for static files to be served by express

const listItems = [];
const workItems = [];

app.get("/", (req, res) => {
  res.render("list", {
    listTitle: date.getDate(),
    listItems: listItems,
  });
});

app.post("/", (req, res) => {
  if (req.body.button === "Work") {
    workItems.push(req.body.newItem);
    res.redirect("/work");
  } else {
    listItems.push(req.body.newItem);
    res.redirect("/");
  }
});

app.get("/work", (req, res) => {
  res.render("list", {
    listTitle: "Work",
    listItems: workItems,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen("3000", () => {
  console.log("Server running");
});