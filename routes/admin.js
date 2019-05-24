const mongoose = require('mongoose');
const Products = require('../models/product_categories/products');
const ServiceProvider = require('../models/serviceProvider');
const User = require('../models/user');
const Admin = require('../models/admin');
const Provider = require('../models/serviceProvider');
const Order = require('../models/order');
const config = require('../config/secret');
const jwt = require('jsonwebtoken');
var randomstring = require("randomstring");
const orderDao = require("../dao/orderDao");
var roles = require("../common/roles").roles;
var applicationRoleAuthorities = require("../common/roles").applicationRoleAuthorities;


module.exports = function(router){

    // register admin api
    router.post('/admin/signup', function (req, res) {
        if (!req.body.username) {
            res.status(400).json({success: false, message: 'Username is required'});
        } else {
            if (!req.body.password) {
                res.status(400).json({success: false, message: 'Password is required'});
            }
            else {
                var admin = new Admin({
                    username: req.body.username,
                    password: req.body.password
                });
                admin.save(function (err) {
                    if (err) {
                        if (err.code === 11000) {
                            res.status(400).json({success: false, message: 'Username already exists'});
                        } else {
                            if (err.errors) {
                                if (err.errors.username) {
                                    res.status(400).json({success: false, message: err.errors.username.message });
                                } else {
                                    if (err.errors.password) {
                                        res.status(400).json({
                                            success: false,
                                            message: err.errors.password.message
                                        });
                                    } else {
                                        res.status(400).json({ success: false, message: err });
                                    }
                                }
                            } else {
                                console.log(err);
                                res.status(500).json({success: false, message: 'Could not create user'});
                            }
                        }
                    } else {
                        res.status(200).json({success: true, message: 'Account Created'});
                    }
                });
            }
        }
    });

    // logging api functionality
    router.post('/admin/login', function(req,res) {
        if (!req.body.username) {
            res.status(400).json({success: false, message: 'Username must be provided'});
        } else {
            if (!req.body.password) {
                res.status(400).json({success: false, message: 'No password was provided'});
            } else {
                Admin.findOne({username: req.body.username}, function (err, admin) {
                    if (err) {
                        res.status(500).json({success: false, message: 'An error occurred'});
                    } else {
                        if (!admin) {
                            res.status(400).json({success: false, message: 'User was not found.'});
                        } else {
                            admin.comparePassword(req.body.password, (err, isMatch) => {
                                if (err || !isMatch) {
                                    res.status(400).json({success: false, message: 'Password was invalid'});
                                }
                                else {
                                    const token = jwt.sign(
                                        {info: {id: admin._id, name: admin.username, role: roles.SUPER_ADMIN, authorities:applicationRoleAuthorities.SUPER_ADMIN_AUTHORITIES}},
                                        config.secretKey, {expiresIn: '5h'});
                                    res.status(200).json({
                                        success: true, message: 'Success!', token: token, admin: {
                                            id: admin._id
                                        }
                                    });
                                }

                            })
                        }
                    }
                });
            }
        }
    });


    /* BEGINNING OF ALL ENDPOINTS THAT REQUIRE TOKEN */

    // setting up the token for the Customer on login

    const tokenChecker = function (req, res, next) {
        var token = req.headers['authorization'];
        if (!token){
            res.status(400).json({ success: false, message: 'No token provided' });
        } else {
            token = token.replace(/^Bearer\s/, '');
            jwt.verify(token, config.secretKey, function(err, decoded) {
                if (err) {
                    res.status(400).json({ success: false, message: 'token invalid: ' +err });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    };

    // register staff api
    router.post('/admin/registerStaff', tokenChecker, function (req, res) {
        if (!req.body.username) {
            res.status(400).json({success: false, message: 'Username is required'});
        } else {
            if (!req.body.password) {
                res.status(400).json({success: false, message: 'Password is required'});
            }
            else {
                var staff = new Staff({
                    username: req.body.username,
                    password: req.body.password
                });
                staff.save(function (err) {
                    if (err) {
                        if (err.code === 11000) {
                            res.status(500).json({success: false, message: 'Username already exists'});
                        } else {
                            if (err.errors) {
                                if (err.errors.username) {
                                    res.status(400).json({success: false, message: err.errors.username.message });
                                } else {
                                    if (err.errors.password) {
                                        res.status(400).json({
                                            success: false,
                                            message: err.errors.password.message
                                        });
                                    } else {
                                        res.status(400).json({ success: false, message: err });
                                    }
                                }
                            } else {
                                res.status(500).json({success: false, message: 'Could not create user'});
                            }
                        }
                    } else {
                        res.status(200).json({success: true, message: 'Account Created'});
                    }
                });
            }
        }
    });

    //API to get a particular provider
    router.get('/admin/providers/:id', tokenChecker, function (req, res) {
        Provider.findOne({ id: req.params.id}, function (err, user) {
           if (err) {
               res.status(500).json({success: false, message: err});
           } else {
               if (!user) {
                   res.status(400).json({success: false, message: 'Provider was not found'});
               } else {
                   res.status(200).json({ success: false, provider: user});
               }
           }
       }) ;
    });

    //API to get all providers
    router.get('/admin/providers/', tokenChecker, function (req, res) {
        Provider.paginate({},{page: parseInt(req.query.pageNum), limit:parseInt(req.query.pageSize)}).then(function(providers) {
                if (!providers) {
                    res.status(400).json({success: false, message: 'No Provider found'});
                } else {
                    res.status(200).json(providers);
                }
        }).catch(function (err) {
            if (err) {
                res.status(500).json({success: false, message: err});
            }
        });
    });

    //API to update a particular provider's detail

    router.put('/admin/providers/:id', tokenChecker, function (req, res) {
        const providerId = req.params.id;
        var updatedProvider = req.body;
        Provider.findByIdAndUpdate(providerId,{status:updatedProvider.status}).exec()
            .then(function (result) {
                //todo disabling provider status should disable all their products too
                res.status(200).json({ success: true, message: "updated provider"});
            }).catch(function (err) {
                res.status(500).json({success:false,message:err});
            })
    });

    //API to get all orders
    router.get('/admin/orders/',tokenChecker,(req,res)=>{
        orderDao.getProductOrdersAsAdmin(req,res).then(result=>{
            res.status(200).json(result);
        }).catch(err=>{
            res.status(err.code).json({success:err.success,message:err.message})
        });
    });

    router.put('/admin/single-order/:orderId', tokenChecker, function (req, res) {
        orderDao.updateSingleOrderDeliveryStatus(req,res);
    });

    router.put('/admin/order/:orderCode', tokenChecker, function (req, res) {
        orderDao.updateOrderDeliveryStatus(req,res);
    });

    return router;
};
