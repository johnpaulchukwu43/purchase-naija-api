const _ = require('lodash');
const fs = require('fs');
const path = require('path');


exports.getConfigFilename = () => {
    let filename = path.join(__dirname, '../config', 'settings-local.json');
    if(fs.existsSync(filename)){
        return filename;
    }
    return path.join(__dirname, '../config', 'settings.json');
};

exports.getConfig = () => {
    let config = JSON.parse(fs.readFileSync(exports.getConfigFilename(), 'utf8'));

    // set the environment for files
    config.env = '.min';
    if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined){
        config.env = '';
    }

    // if db set to mongodb override connection with MONGODB_CONNECTION_STRING env var
    config.databaseConnectionString = process.env.MONGODB_CONNECTION_STRING || config.databaseConnectionString;

    config.secret = process.env.SECRET || config.secret;

    return config;
};
