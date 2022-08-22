//module declaration
const {default: mongoose} = require("mongoose");
const mongooose = require("mongoose");
let conn;

//DB schemas
//TODO: breng db schemas naar local files?
const itemSchema = {
    name: {
        type: String,
        required: true
    },
};

const listSchema = {
    name: {
        type: String,
        required: true
    },
    items: [itemSchema]
}

//DB Models
const Item = mongooose.model("item", itemSchema);

async function openConnection(db) {
   conn = await mongoose.connect(db);
}

module.exports.getAllItems = getAllItems;
async function getAllItems(db) {
    await openConnection(db);
    //finding all documents
    const items = await Item.find({}).exec();

    await closeConnection();
    return items;
}

module.exports.addItem = addItem;
async function addItem(itemNames, db) {
    //opening db connection
    await openConnection(db);

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

module.exports.deleteItemById = deleteItemById;
async function deleteItemById(id, db){
    await openConnection(db);
    await Item.findByIdAndDelete(id);
    await closeConnection();
}

async function closeConnection() {
    conn.disconnect();
}