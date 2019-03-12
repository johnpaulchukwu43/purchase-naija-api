const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var moment = require('moment');

const baseProductSchema = require('./products');

const schema = Object.assign({},baseProductSchema ,{
    SubCategory:{ type: String }
});

const RawMaterialSchema = new Schema (schema);

module.exports = mongoose.model('Rawmaterial', RawMaterialSchema);

