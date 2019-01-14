import {MongoClient} from 'mongodb'


const url = 'mongodb://localhost:27017/purchaseNaija';


export const connect = (callback) => {

    MongoClient.connect(url, (err, db) =>
    {
        return callback(err, db);

    });
};

