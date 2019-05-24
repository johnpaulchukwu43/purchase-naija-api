const mongoose = require('./baseMongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userCartSchema = new Schema ({
    userId: { type: String, required: true } ,
    category: { type: String, required: true },
    productId: { type: String},
    quantity: { type: Number, required: true },
    cartType:{type:String, required:true},
    provider:{type:String,required:true},
    status:{ type: String }
});



module.exports = mongoose.model('userCart', userCartSchema);
