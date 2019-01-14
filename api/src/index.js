import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import {connect} from "./config/database";
import nodemailer from "nodemailer";
import {smtp} from "./config/email";
import ApiRouter from "./routes/";
import userRouter from "./routes/customer";
import path from 'path';

//set base name of api
let base_path = '/api/v1';
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
connect((err, db) => {

    if(err){
        console.log("An error connecting to the database", err);
        throw (err);
    }

    app.db = db;
    app.set('db', db);


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

