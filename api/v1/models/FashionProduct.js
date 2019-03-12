const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const baseProductSchema = require('./products');


const schema = Object.assign({},baseProductSchema ,{
    Size:{ type: String },
    Brand:{ type: String },
    Gender:{ type: String },
    SubCategory:{ type: String }
});

const FashionSchema = new Schema (schema);


module.exports = mongoose.model('Fashion', FashionSchema);

