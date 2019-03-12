const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const baseProductSchema = require('./products');


const schema = Object.assign({},baseProductSchema ,{
    SubCategory: {type: String, required: true}
});

const ManufacturingSchema = new Schema (schema);

module.exports = mongoose.model('Manufacturing', ManufacturingSchema);

