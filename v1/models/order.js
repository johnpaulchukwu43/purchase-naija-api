const mongoose = require('./baseMongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const auditSchema = require('./auditable');


var customSchema = Object.assign({},{
    userId: { type: String, required: true } ,
    name: { type: String, required: true } ,
    orderCode: { type: String,required:true },
    paymentType:{type:String,required:true},
    provider:{type:String,required:true},
    paymentID: {type: String},
    isDelivered: {
        type: Boolean,
        default: false
    },
    userCart: {type:Schema.Types.Mixed,required:true}

},auditSchema);
const OrderSchema = new Schema (customSchema);
module.exports = mongoose.model('Order', OrderSchema);
