// importing all libraries needed for this project
var express = require("express"), MongoClient = require('mongodb').MongoClient, assert = require('assert'), bodyParser = require("body-parser"), ObjectID = require('mongodb').ObjectID;

// getting instance of express
const app = express();

// used body-parser library to properly decode the response body of POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// serving assets folder to use the css and js files
app.use(express.static(__dirname + "/assets"));

// default MongoDB server link (you can change `mydb` to your liking)
let url = "mongodb://127.0.0.1:27017/mydb";

// server will listen to port 3000
app.listen(3000);

// default address (say http://localhost:3000) will all be routed to this block.
app.get("/", (req, res) => {

    // uses the HTML file as output
    res.sendFile(__dirname + "/app.html");
});

// this will show the details of the user given a username
app.get("/user/show/:username", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        let user = db.collection("users").find({username: req.params.username});
        user.toArray((err, result) => {
            res.send(result);
            db.close();
        });
    });
});

// this will insert a user to the database
app.post("/user/register", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        let user = {username: req.body.username, password: req.body.password};
        db.collection("users").insertOne(user, (err, result) => {
            res.json({status: 200});
            db.close();
        });
    });
});

// this will update the user given its `_id` as its parameter
app.post("/user/update", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        db.collection("users").updateOne(
            // converting string to readable ObjectID because when you insert a document to a collection without specifying the ID, it uses this.
            {_id: ObjectID(req.body._id)},
            {$set: {username: req.body.username, password: req.body.password}
        });
        res.send();
        db.close();
    });
});

// this will remove a specific user to the collection given its `_id`
app.post("/user/remove", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        db.collection("users").remove({_id: ObjectID(req.body._id)});
        res.send({status: 200});
        db.close();
    });
});

// returns all users on a collection as JSON
app.get("/user/all", (req, res) => {
    MongoClient.connect(url, (err, db) => {
        let users = db.collection("users").find();
        users.toArray(function(err, result) {
            res.send(result);
            db.close();
        });
    });
});