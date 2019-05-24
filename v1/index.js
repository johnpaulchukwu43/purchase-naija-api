const express = require("express");

const secret = require('./config/secret');
//Set port number
const morgan = require('morgan');
const mongoose = require('mongoose');
var User = require('./models/user');
const bodyParser = require('body-parser');
const router = express.Router();
var cors = require("cors");
const syncCollectionsWithElasticSearch = require('./dao/baseRequest').syncCollectionsWithElasticSearch;
var user = require('./routes/customer')(router);
var admin = require('./routes/admin')(router);
var serviceProvider = require('./routes/serviceProvider')(router);
var guest = require('./routes/guest')(router);
var transactions = require('./routes/transactions')(router);
let base_path = '/api/v1';

const app = express();

//db connection
console.log(JSON.stringify(secret));
mongoose.connect(secret.database, {
    "user":secret.databaseUsername,
    "pass":secret.databasePassword,
    "authSource":secret.authDatabase
}, (err)=> {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to the database");
    }
});

//elasticsearch set up
syncCollectionsWithElasticSearch();

//cors setup
var corsOptions = {
    origin: 'http://localhost:8000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

//Middle ware
app.use(express.static(__dirname + '/public'));

app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded( { extended: true }));


app.use(base_path,user);
app.use(base_path,admin);
app.use(base_path,serviceProvider);
app.use(base_path,guest);
app.use(base_path,transactions);

app.listen(secret.port, function (err) {
    if (err) throw err;
    console.log("Server is running " + secret.port);
});
