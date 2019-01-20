import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import nodemailer from "nodemailer";
import {smtp} from "./config/email";
import colors from 'colors'
import {MongoClient} from 'mongodb'
import userRouter from "./routes/customer";
import path from 'path';
import  common from "./lib/common";
import mongodbUri from 'mongodb-uri'

//set base name of api
let base_path = '/api/v1';
//import config
let config = common.getConfig();

// Email Config
let email = nodemailer.createTransport(smtp);

const PORT = normalizePort(process.env.PORT || '9001');

const app = express();
app.server = http.createServer(app);

// todo add favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(cors({
    exposedHeaders: "*"
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(express.static(path.join(__dirname, 'build')));
app.set('root', __dirname);
app.email = email;
//Connect to the database.
MongoClient.connect(config.databaseConnectionString, {}, (err, client) => {
    // On connection error we display then exit
    if(err){
        console.log(colors.red('Error connecting to MongoDB: ' + err));
        process.exit(2);
    }

    // select DB
    const dbUriObj = mongodbUri.parse(config.databaseConnectionString);
    let db = client.db(dbUriObj.database);
    // setup the collections
    db.users = db.collection('users');
    db.products = db.collection('products');
    db.orders = db.collection('orders');
    // add db to app for routes
    app.dbClient = client;
    app.db = db;
    app.config = config;
    // init routers.
    app.use(addBasePath('/user'),userRouter);

    app.use((req, res, next) => {
        let err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    /**
     * Listen on provided port, on all network interfaces.
     */
    app.server.listen(PORT);
    app.server.on('error', onError);
    app.server.on('listening', onListening);

});

function addBasePath(other_part){
    return base_path+other_part;
}

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof PORT === 'string'
        ? 'Pipe ' + PORT
        : 'Port ' + PORT;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = app.server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'PORT ' + PORT;
    console.log('Listening on ' + bind);
}

