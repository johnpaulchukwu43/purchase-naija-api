/*
 Created by Johnpaul Chukwu @ $
*/
const mongoose = require('./baseMongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const auditSchema = require('./auditable');


var customSchema = Object.assign({},{
    name: { type: String,} ,
    owner:{type:String,required: true},
    accountNumber: { type: String,required:true},
    bankName:{type:String,required:true}
},auditSchema);

const bankAccount = new Schema (customSchema);
module.exports = mongoose.model('BankAccount', bankAccount);
