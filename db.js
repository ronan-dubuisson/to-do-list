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

function getAllItems(db) {
    const conn = openConnection(db);

     conn.once('open', () => {

        //finding all documents

         Item.find({}, (err, docs) => {
            if (err) throw err;

            closeConnection();

            return docs;
        });
    });
}

function closeConnection() {
    mongoose.connection.close();
}
