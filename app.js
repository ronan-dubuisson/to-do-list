//declaring modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const database = require(__dirname + "/db.js");
//TODO: Breng default values naar local file
const dbConnectionString = "mongodb://localhost:27017/toDoListDB";
const db = new database(dbConnectionString);
const defaultTodoItems = ["Welcome To Your To Do List", "Hit the + button to add a new item", " <-- check to mark the item as done", "hit the - button to delete an item"];

//setting up express and its uses
const app = express();
app.set("view engine", "ejs"); //view engine for templating
app.use(bodyParser.urlencoded({extended: true})); //enabeling parsing of body for requests
app.use(express.static("public")); //defining folder for static files to be served by express

app.get("/", (req, res) => {
    //using the then as async functions return promises
    db.getAllItems().then((items) => {

        if(items.length===0){
            //if no items are in the db, add default items
            db.addItem(defaultTodoItems).then(()=>{
                    res.redirect("/");
            });
        } else {
            //reading out the items and render it to the page
            res.render("list", {
                listTitle: date.getDate(),
                listItems: items
            });
        }
    })
});

app.post("/", (req, res) => {
    db.addItem([req.body.newItem]).then(() => {
        //only do the redirect after the promise is fullfilled.
        res.redirect("/");
    });
});

app.get("/:customListName",(req, res)=>{
    const customListName = req.params.customListName;
    db.getAllItems().then((items)=>{
        res.render("list",{
            listTitle: customListName,
            listItems: items
        })
    })
})

app.post("/delete",(req, res)=>{
    db.deleteItemById(req.body.checkbox).then(()=>{
        res.redirect("/");
    });
})

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen("3000", () => {
    console.log("Server running");
});