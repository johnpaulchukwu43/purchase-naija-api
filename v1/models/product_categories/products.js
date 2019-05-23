const ProductAuditSchema = require('../productAuditable');



const BaseProductSchema = Object.assign({},{
    name: { type: String, required: true,es_type:'text' } ,
    price: { type: Number, required: true },
    description: { type: String, required: true,es_type:'text' },
    // Product code
    productCode: { type: String,es_type:'text'},
    imageUrls: [{
        type: String,
        es_type:'text'
    }],
    quantity: { type: Number, required: true},
    provider:{ type: String, required: true,es_type:'text'},
    providerStatus:{type:String,required:true,default:"ACTIVE",es_type:'text'},
    colors: [{
        type: String,
        es_type:'text',
        default:"default"
    }]
},ProductAuditSchema);

module.exports = BaseProductSchema;





