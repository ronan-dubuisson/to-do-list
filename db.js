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

//DB Models
const Item = mongooose.model("item", itemSchema);

async function openConnection(db) {
   conn = await mongoose.connect(db);
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

module.exports.getAllItems = getAllItems;

async function getAllItems(db) {
    const itemNames = [];
    await openConnection(db);
    //finding all documents
    const items = await Item.find({}).exec();

    items.forEach((item)=>{
        itemNames.push(item.name);
    });

    await closeConnection();
    return itemNames;
}

async function closeConnection() {
    conn.disconnect();
}