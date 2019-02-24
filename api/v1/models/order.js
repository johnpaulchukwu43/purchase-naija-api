const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const OrderSchema = new Schema ({
    userEmail: { type: String, required: true } ,
    orderCode: { type: String } ,
    paymentID: {type: String},
    userCart: []

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


module.exports = mongoose.model('Order', OrderSchema);
// module.exports = mongoose.model('Manufacturing', ManufacturingSchema);