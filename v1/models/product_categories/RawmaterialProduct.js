const mongoose = require('../baseMongoose');
const Schema = mongoose.Schema;
const raw = require('../../common/constants').rawMaterialCollection;


const baseProductSchema = require('./products');

const schema = Object.assign({},baseProductSchema ,{
    productCategory: { type: String , es_type:'text', default: raw},
    SubCategory:{ type: String , es_type:'text' }
});

const RawMaterialSchema = new Schema (schema,{collection:raw});

module.exports = mongoose.model('Rawmaterial', RawMaterialSchema);

