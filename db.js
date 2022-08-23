// module declaration
const { default: mongoose } = require('mongoose');

let conn;

// DB schemas
// TODO: breng db schemas naar local files?
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  items: [itemSchema],
});

// DB Models
const Item = mongoose.model('item', itemSchema);
const List = mongoose.model('list', listSchema);

function Db(connectionString) {
  this.connectionString = connectionString;
}

async function openConnection(connectionString) {
  conn = await mongoose.connect(connectionString);
}

async function closeConnection() {
  conn.disconnect();
}

async function getAllItems() {
  await openConnection(this.connectionString);
  // finding all documents
  const items = await Item.find({}).exec();

  await closeConnection();
  return items;
}

async function addItem(itemNames) {
  // opening db connection
  await openConnection(this.connectionString);
  // Creating the items documents
  const items = [];
  itemNames.forEach((itemName) => {
    items.push({
      name: itemName,
    });
  });

  // add items to the db
  await Item.insertMany(items);
  await closeConnection();
}

async function findList(listName, upsert, item) {
  await openConnection(this.connectionString);
  const conditions = { name: listName };
  const update = { name: listName };
  const options = { upsert, new: true };
  const list = await List.findOneAndUpdate(conditions, update, options).exec();

  if (item) {
    list.items.push({
      name: item,
    });
    await list.save();
  }

  await closeConnection();

  return list;
}

async function deleteItemById(id) {
  await openConnection(this.connectionString);
  await Item.findByIdAndDelete(id);
  await closeConnection();
}

module.exports = Db;
Db.prototype.addItem = addItem;
Db.prototype.getAllItems = getAllItems;
Db.prototype.deleteItemById = deleteItemById;
Db.prototype.findList = findList;
