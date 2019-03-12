const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const baseProductSchema = require('./products');


var beautySchema = Object.assign({},baseProductSchema ,{
    brand: { type: String },
    gender: { type: String },
    SubCategory: {type: String, required: true}
});

const BeautySchema = new Schema (beautySchema);

module.exports = mongoose.model('Beauty', BeautySchema);

