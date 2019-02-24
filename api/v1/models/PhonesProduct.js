const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var moment = require('moment');

const PhoneSchema = new Schema ({
    name: { type: String, required: true } ,
    serviceProvider: { type: String, required: true },
    price: { type: String, required: true },
    description: { type: String, required: true },
    // Product code
    productCode: { type: String},
    // description: { type: String, default: 'No Description' },
    imageUrl: { type: String, required: true },
    quantity: { type: String, required: true },
    productCategory: { type: String, required: true},
    createdAt: { type: String, default: moment().format("L") },
    updatedAt: { type: String, default: moment().format("L") },
    color: { type: String },
    Size: { type: String },
    Brand: { type: String },
    ScreenSize: { type: String },
    CameraQuality: { type: String },
    Ram: { type: String },
    BatteryPower: { type: String },
    InternalMemory: { type: String },
    SimSlotNumber: { type: String }




});

/*// Extend function
const extend = (Schema, obj) => (
    new mongoose.Schema(
        Object.assign({}, Schema.obj, obj)
    )
);

// Usage:
const ManufacturingSchema = extend(BaseProductSchema, {
    SubCategory: {type: String, required: true},
});*/


// module.exports = mongoose.model('BaseProduct', BaseProductSchema);
module.exports = mongoose.model('Phone', PhoneSchema);

