const mongoose = require('../baseMongoose');
const Schema = mongoose.Schema;
const phones = require('../../common/constants').phoneCollection;




const baseProductSchema = require('./products');
const schema = Object.assign({},baseProductSchema ,{
    productCategory: { type: String , es_type:'text', default: phones},
    size: { type: String , es_type:'text' },
    brand: { type: String , es_type:'text' },
    screenSize: { type: String , es_type:'text' },
    cameraQuality: { type: String , es_type:'text' },
    ram: { type: String , es_type:'text' },
    batteryPower: { type: String , es_type:'text' },
    internalMemory: { type: String , es_type:'text' },
    simSlotNumber: { type: String , es_type:'text' }
});
const PhoneSchema = new Schema (schema,{collection:phones});

module.exports = mongoose.model('Phone', PhoneSchema);

