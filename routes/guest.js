/*
 Created by Johnpaul Chukwu @ $
*/
var randomstring = require("randomstring");
const jwt = require('jsonwebtoken');
const config = require('../config/secret');


module.exports = function (router) {
    router.get('/guest/getToken', function (req, res) {
        const timestamp = new Date().getTime();
        var guestId = 'GUEST-' + timestamp + '-' + randomstring.generate(5);
        const token = jwt.sign({guestId: guestId}, config.secretKey, {expiresIn: '2d'});
        res.status(200).json({success: true, message: 'Success!', token: token});
    });

    return router;
};
