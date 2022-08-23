require('ejs');
const express = require('express');
const bodyParser = require('body-parser');

// eslint-disable-next-line import/no-dynamic-require
const date = require(`${__dirname}/date.js`);
// eslint-disable-next-line import/no-dynamic-require
const database = require(`${__dirname}/db.js`);
// TODO: breng default values naar local file
const dbConnectionString = 'mongodb://localhost:27017/toDoListDB';
// eslint-disable-next-line new-cap
const db = new database(dbConnectionString);
const defaultTodoItems = [
  'Welcome To Your To Do List',
  'Hit the + button to add a new item',
  ' <-- check to mark the item as done',
  'hit the - button to delete an item',
];

// setting up express and its uses
const app = express();
app.set('view engine', 'ejs'); // view engine for templating
app.use(bodyParser.urlencoded({ extended: true })); // enabeling parsing of body for requests
app.use(express.static('public')); // defining folder for static files to be served by express

app.get('/', (req, res) => {
  db.getAllItems().then((items) => {
    if (items.length === 0) {
      // if no items are in the db, add default items
      db.addItem(defaultTodoItems).then(() => {
        res.redirect('/');
      });
    } else {
      // reading out the items and render it to the page
      res.render('list', {
        listTitle: 'Today',
        listItems: items,
      });
    }
  });
  // eslint-disable-next-line no-empty
  // using the then as async functions return promises
});

app.post('/', (req, res) => {
  const { listName } = req.body;
  const { newItem } = req.body;

  if (listName === 'Today') {
    db.addItem([newItem]).then(() => {
      // only do the redirect after the promise is fullfilled.
      res.redirect('/');
    });
  } else {
    db.findList(listName, false, newItem).then(() => {
      res.redirect(`/${listName}`);
    });
  }
});

app.post('/delete', (req, res) => {
  db.deleteItemById(req.body.checkbox).then(() => {
    res.redirect('/');
  });
});

app.get('/:customListName', (req, res) => {
  const customListName = req.params.customListName;

  if (customListName === 'favicon.ico') {
    res.status(204).send();
  } else {
    db.findList(customListName, true).then((list) => {
      res.render('list', {
        listTitle: customListName,
        listItems: list.items,
      });
    });
  }
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen('3000', () => {
  console.log(`${new Date().toISOString()}: Server running`);
});
