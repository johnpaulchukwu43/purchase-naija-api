const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var moment = require('moment');


const baseProductSchema = require('./products');
const schema = Object.assign({},baseProductSchema ,{
    Size: { type: String },
    Brand: { type: String },
    ScreenSize: { type: String },
    CameraQuality: { type: String },
    Ram: { type: String },
    BatteryPower: { type: String },
    InternalMemory: { type: String },
    SimSlotNumber: { type: String }
});
const PhoneSchema = new Schema (schema);

module.exports = mongoose.model('Phone', PhoneSchema);

