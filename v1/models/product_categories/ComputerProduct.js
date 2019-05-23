const mongoose = require('../baseMongoose');
const Schema = mongoose.Schema;
const computers = require('../../common/constants').computerCollection;


const baseProductSchema = require('./products');

const schema = Object.assign({},baseProductSchema ,{
    productCategory: { type: String , es_type:'text', default: computers},
    os: { type: String , es_type:'text' },
    screen :{ type: String , es_type:'text' },
    ram:{ type: String , es_type:'text' },
    processor:{ type: String , es_type:'text' },
    brand:{ type: String , es_type:'text' },
    memorySpace:{ type: String , es_type:'text' }
});
const ComputerSchema = new Schema (schema,{collection:computers});
// module.exports = mongoose.model('BaseProduct', BaseProductSchema);
module.exports = mongoose.model('Computer', ComputerSchema);

