const mongoose = require('../baseMongoose');
const Schema = mongoose.Schema;
const baseProductSchema = require('./products');
const fashion = require('../../common/constants').fashionCollection;


const schema = Object.assign({},baseProductSchema ,{
    productCategory: { type: String , es_type:'text', default: fashion},
    size:{ type: String , es_type:'text' },
    brand:{ type: String , es_type:'text' },
    gender:{ type: String , es_type:'text',required:true },
    subCategory:{ type: String , es_type:'text' }
});

const FashionSchema = new Schema (schema);
module.exports = mongoose.model('Fashion', FashionSchema);

