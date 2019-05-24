/*
 Created by Johnpaul Chukwu @ $
*/

const paystackKey = require('../config/secret').paystackKey;

var paystack = require('paystack')(paystackKey);


module.exports = function (router) {
    router.get('/payment/:reference', function (req, res) {
        var paymentRefernce = req.params.reference;
        paystack.transaction.verify(paymentRefernce, function (error, body) {
           if(error){
               res.status(400).json(error);
           }else{
               res.status(200).json(body);
           }
        });


    });

    return router;
};
