var moment = require('moment');

const BaseProductSchema = {
    name: { type: String, required: true } ,
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
    colors: { type: String }
};

module.exports = BaseProductSchema;


