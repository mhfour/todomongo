var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var path = require("path");
var https = require('https');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'myproject';

//const db="";
var globalDB = "";

// Use connect method to connect to the server
MongoClient.connect(url, function (err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  globalDB = client.db(dbName);

  // client.close();
});

const insertDocuments = function (_db, data, callback) {
  // Get the documents collection
  const collection = _db.collection('documents');
  // Insert some documents
  collection.insert([
    // Get the documents collection
    { a: data }
  ], function (err, result) {
    assert.equal(err, null);
    
    callback(result);
  });
}

const findDocuments = function (_db, callback) {
  // Get the documents collection
  const collection = _db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function (err, result) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(result);
    callback(result);
  });
}

const updateDocument = function (_db, callback) {
  // Get the documents collection
  const collection = _db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a: 2 }
    , { $set: { b: 1 } }, function (err, result) {
      assert.equal(err, null);
      assert.equal(1, result.result.n);
      console.log("Updated the document with the field a equal to 2");
      callback(result);
    });
}

const removeDocument = function (db, callback) {
  // Get the documents collection
  const collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteOne({ a: 3 }, function (err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });
} 

var todoList = [];
EditedItem = null;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.post('/InsertTodo', function (req, res) {
  var date = new Date();
  var _id = 0;
  if (todoList.length > 0) {
    _id = todoList[todoList.length - 1].id + 1;
  }
  var dt = date.toLocaleString();

  var todoitem = { id: _id, item: req.body.item, createdTime: dt, completedTime: "", status: "new" };

  todoList.push(todoitem);

  insertDocuments(globalDB, todoList, (function (result) {
    console.log(result);
  }))
  res.send(todoitem);
});

app.get('/GetAllTodo', function (req, res) {
  res.json({ todoList });

  findDocuments(globalDB, todoList, (function (result) {
    console.log(result);
  }))
});

app.put('/UpdateTodo/:id', function (req, res) {

  req.params.id = Number(req.params.id);
  console.log("item : " + JSON.stringify(req.body));

  const item = todoList.find(item => item.id === req.params.id);

  //console.log("item : " + JSON.stringify(item));
  if (item != undefined) {
    //console.log("item : " + JSON.stringify(req.body.item));
    item.item = req.body.item;
    //console.log("item : " + JSON.stringify(item));
  }
  //todoList.push(todoitem);
  updateDocument(globalDB, todoList, (function (result) {
    console.log(result);
  }))

  res.send(todoList);
});

app.delete('/DelTodo/:id', function (req, res) {

  //console.log("id : " + req.params.id);
  const item = todoList.find(item => item.id == req.params.id);
  //console.log("item : " + JSON.stringify(item));
  if (item != undefined) {
    todoList.splice(todoList.indexOf(item), 1);
  }

  removeDocument(globalDB, todoList, (function (result) {
    console.log(result);
  }))

  res.send(todoList);
});

app.listen(3020);

console.log("Running on port 3020");