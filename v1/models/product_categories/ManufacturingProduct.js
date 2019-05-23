const mongoose = require('../baseMongoose');
const Schema = mongoose.Schema;
const baseProductSchema = require('./products');
const manufacturing = require('../../common/constants').manufacturingCollection;



const schema = Object.assign({},baseProductSchema ,{
    productCategory: { type: String , es_type:'text', default: manufacturing},
    subCategory: {type: String , es_type:'text'}
});

const ManufacturingSchema = new Schema (schema,{collection:manufacturing});

module.exports = mongoose.model('Manufacturing', ManufacturingSchema);

