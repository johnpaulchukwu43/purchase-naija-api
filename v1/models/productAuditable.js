const auditSchema = require('./auditable');

const ProductAuditSchema = Object.assign({},{
    quantityOrdered: { type: Number, default: 0 }
},auditSchema);

module.exports = ProductAuditSchema;





