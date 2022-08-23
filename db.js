//module declaration
const mongoose = require("mongoose");

let conn;

//DB schemas
//TODO: breng db schemas naar local files?
const itemSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
});

const listSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
    },
    items: [itemSchema]
});

//DB Models
const Item = mongoose.model("item", itemSchema);
const List = mongoose.model("list", listSchema);

module.exports = Db;
function Db(connectionString){
    this.connectionString = connectionString;
}

async function openConnection(connectionString) {
   conn = await mongoose.connect(connectionString);
}

Db.prototype.getAllItems = getAllItems;
async function getAllItems() {
    await openConnection(this.connectionString);
    //finding all documents
    const items = await Item.find({}).exec();

    await closeConnection();
    return items;
}

Db.prototype.addItem = addItem;
async function addItem(itemNames) {
    //opening db connection
    await openConnection(this.connectionString);

    //Creating the items documents
    const items = [];
    itemNames.forEach((itemName)=>{
        items.push({
            name:itemName
        });
    });

    //add items to the db
    await Item.insertMany(items);
    await closeConnection();
}

Db.prototype.deleteItemById = deleteItemById;
async function deleteItemById(id){
    await openConnection(this.connectionString);
    await Item.findByIdAndDelete(id);
    await closeConnection();
}

async function closeConnection() {
    conn.disconnect();
}