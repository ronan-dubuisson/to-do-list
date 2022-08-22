//module declaration
const {default: mongoose} = require("mongoose");
const mongooose = require("mongoose");
let results;
//DB schemas
const itemSchema = {
    name: {
        type: String,
        required: true,
    },
};

//DB Models
const Item = mongooose.model("item", itemSchema);

function openConnection(db) {
    mongoose.connect(db);
    return mongoose.connection;
}

module.exports.addItem = addItem;

function addItem(name, db) {
    //opening db connection
    const conn = openConnection(db);

    //checking for connection to be open before sending in data
    conn.once('open', () => {

        //creating new document in the db
        Item.create({
                name: name
            },
            (err) => {
                if (err) {
                    console.log(err);
                }
                closeConnection();
            });
    });
}

module.exports.getAllItems = getAllItems;

async function getAllItems(db) {
    const itemNames = [];
    openConnection(db);
    //finding all documents
    const results = await Item.find({}).exec();
    results.forEach((result)=>{
        itemNames.push(result.name);
    });

    closeConnection();

    return itemNames;
}

function closeConnection() {
    mongoose.connection.close((locus) => locus);
}
