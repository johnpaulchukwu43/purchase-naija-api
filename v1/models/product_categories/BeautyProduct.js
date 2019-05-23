const mongoose = require('../baseMongoose');
const Schema = mongoose.Schema;
const baseProductSchema = require('./products');
const beauties = require('../../common/constants').beautyCollection;


var beautySchema = Object.assign({},baseProductSchema ,{
    productCategory: { type: String , es_type:'text', default: beauties},
    brand: { type: String , es_type:'text' },
    gender: { type: String , es_type:'text' },
    subCategory: {type: String , es_type:'text'}
});

const BeautySchema = new Schema (beautySchema,{collection:beauties});

module.exports = mongoose.model('Beauty', BeautySchema);

