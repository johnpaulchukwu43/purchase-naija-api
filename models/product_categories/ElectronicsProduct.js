const mongoose = require('../baseMongoose');
const Schema = mongoose.Schema;
const baseProductSchema = require('./products');
const electronics = require('../../common/constants').electronicCollections;




const schema = Object.assign({},baseProductSchema ,{
    productCategory: { type: String , es_type:'text', default: electronics},
    size:{ type: String , es_type:'text' },
    brand:{ type: String , es_type:'text' },
    subCategory:{ type: String , es_type:'text' }
});

const ElectronicsSchema = new Schema (schema,{collection:electronics});

module.exports = mongoose.model('Electronics', ElectronicsSchema);

