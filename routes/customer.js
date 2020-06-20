const mongoose = require('mongoose');
const User = require('../models/user');
const Products = require('../models/product_categories/products');
const Manufacturing = require('../models/product_categories/ManufacturingProduct');
const Beauty = require('../models/product_categories/BeautyProduct');
const Computer = require('../models/product_categories/ComputerProduct');
const Electronics = require('../models/product_categories/ElectronicsProduct');
const Fashion = require('../models/product_categories/FashionProduct');
const Phone = require('../models/product_categories/PhonesProduct');
const Rawmaterial = require('../models/product_categories/RawmaterialProduct');
const Review = require('../models/review');
const Order = require('../models/order');
const UserCart = require('../models/userCart');
const config = require('../config/secret');
var fashionDao = require('../dao/fashionDao');
var electronicsDao = require('../dao/electronicsDao');
var beautyDao = require('../dao/beautyDao');
var rawDao = require('../dao/rawMaterialDao');
var phoneDao = require('../dao/phoneDao');
var computerDao = require('../dao/computerDao');
var manufacturingDao = require('../dao/manufacturingDao');
var cartDao = require('../dao/cartDao');
var orderDao = require('../dao/orderDao');
var baseRequest = require('../dao/baseRequest');
var validQueryParameters = require('../common/validation').validQueryParameters;

const jwt = require('jsonwebtoken');
const moment = require('moment');
const constant = require('../common/constants');
var randomstring = require("randomstring");


module.exports = function (router) {

    // register api
    router.post('/user/signup', function (req, res) {
        if (!req.body.email) {
            res.status(400).json({success: false, message: 'Email is required'});
        } else {
            if (!req.body.password) {
                res.status(400).json({success: false, message: 'Password is required'});
            } else {
                if (!req.body.firstname) {
                    res.status(400).json({success: false, message: 'First name is required'});
                } else {
                    if (!req.body.lastname) {
                        res.status(400).json({success: false, message: 'Last name is required'});
                    } else {
                        var user = new User({
                            email: req.body.email,
                            password: req.body.password,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname
                        });
                        user.save(function (err) {
                            if (err) {
                                if (err.code === 11000) {
                                    res.status(400).json({success: false, message: 'E-mail already exists'});
                                } else {
                                    if (err.errors) {
                                        if (err.errors.email) {
                                            res.status(400).json({success: false, message: err.errors.email.message});
                                        } else {
                                            if (err.errors.phoneNumber) {
                                                res.status(400).json({
                                                    success: false,
                                                    message: err.errors.phoneNumber.message
                                                });
                                            } else {
                                                if (err.errors.password) {
                                                    res.status(400).json({
                                                        success: false,
                                                        message: err.errors.password.message
                                                    });
                                                } else {
                                                    res.status(400).json({success: false, message: err});
                                                }
                                            }
                                        }
                                    } else {
                                        console.log(JSON.stringify(err));
                                        res.status(500).json({success: false, message: 'Could not create user'});
                                    }
                                }
                            } else {
                                res.status(200).json({success: true, message: 'Account Created'});
                            }
                        });
                    }
                }
            }
        }
    });


    // logging api functionality
    router.post('/user/login', function (req, res) {
        if (!req.body.email) {
            res.status(400).json({success: false, message: 'Email must be provided'});
        } else {
            if (!req.body.password) {
                res.status(400).json({success: false, message: 'No password was provided'});
            } else {
                User.findOne({email: req.body.email}, function (err, user) {
                    if (err) {
                        res.status(500).json({success: false, message: 'An error occurred'});
                    } else {
                        if (!user) {
                            res.status(400).json({success: false, message: 'User was not found.'});
                        } else {
                            user.comparePassword(req.body.password, (err, isMatch) => {
                                if (err || !isMatch) {
                                    res.status(400).json({success: false, message: 'Password was invalid'});
                                } else {
                                    const token = jwt.sign({userId: user._id}, config.secretKey, {expiresIn: '5h'});
                                    res.status(200).json({
                                        success: true, message: 'Success!', token: token, user: {
                                            id: user._id,
                                            email: user.email,
                                            firstname: user.firstname,
                                            lastname: user.lastname,
                                            phoneNumber: user.phoneNumber,
                                            billingAddress1: user.billingAddress1,
                                            billingAddress2: user.billingAddress2,
                                        }
                                    });
                                }
                            });

                        }
                    }
                });
            }
        }
    });

    //Totals
    router.get('/products/fashion/getAllColors/', function (req, res) {
        fashionDao.getAllAvailableColors(res);
    });

    router.get('/products/fashion/getAllBrands/', function (req, res) {
        fashionDao.getAllAvailableBrands(res);
    });
    /*// searching for products based on category
    router.get('/products/search/:productCategory', function (req,res) {
        Products.find({ productCategory: req.params.productCategory }, function (err, products) {
            if(err){
                res.status(400).json({ success: false, message: err });
            } else {
                if (!products) {
                    res.status(400).json({success: false, message: 'No product was found'});
                } else {
                    if (products.length == 0) {
                        res.status(400).json({success: false, message: 'No product was found'});
                    } else {
                        res.status(200).json({success: true, listOfProductCategory: products});
                    }

                }
            }
        });
    });*/

// searching for service provider based on category and date
    router.get('/products/search/manufacturing/:date?', function (req, res) {
        Manufacturing.find({date: req.query.date}, function (err, products) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!products) {
                    res.status(400).json({success: false, message: 'No product was found'});
                } else {
                    if (products.length == 0) {
                        res.status(400).json({success: false, message: 'No product was found'});
                    } else {
                        res.status(200).json({success: true, listOfProductCategory: products});
                    }

                }
            }
        });
    });


    /* BEGINNING OF GETTING ALL PRODUCTS REGARDLESS OF CATEGORY */

    router.get('/getallproducts', function (req, res) {
        var param = validQueryParameters(req,res);
        if(param) {
            Beauty.paginate({}, {page: param.pageNum, limit: param.pageSize}, function (err, beauty) {
                if (err) {
                    res.status(400).json({success: false, message: err});
                } else {
                    if (!beauty) {
                        res.status(400).json({success: false, message: 'No product was found'});
                    } else {
                        Computer.paginate({}, {page: param.pageNum, limit: param.pageSize}, function (err, computer) {
                            if (err) {
                                res.status(400).json({success: false, message: err});
                            } else {
                                if (!computer) {
                                    res.status(400).json({success: false, message: 'No product was found'});
                                } else {
                                    Electronics.paginate({}, {page: param.pageNum, limit: param.pageSize}, function (err, electronics) {
                                        if (err) {
                                            res.status(400).json({success: false, message: err});
                                        } else {
                                            if (!electronics) {
                                                res.status(400).json({success: false, message: 'No product was found'});
                                            } else {
                                                Fashion.paginate({}, {page: param.pageNum, limit: param.pageSize}, function (err, fashion) {
                                                    if (err) {
                                                        res.status(400).json({success: false, message: err});
                                                    } else {
                                                        if (!fashion) {
                                                            res.status(400).json({
                                                                success: false,
                                                                message: 'No product was found'
                                                            });
                                                        } else {
                                                            Manufacturing.paginate({},{page: param.pageNum, limit: param.pageSize},function (err, manufacturing) {
                                                                if (err) {
                                                                    res.status(400).json({
                                                                        success: false,
                                                                        message: err
                                                                    });
                                                                } else {
                                                                    if (!manufacturing) {
                                                                        res.status(400).json({
                                                                            success: false,
                                                                            message: 'No product was found'
                                                                        });
                                                                    } else {
                                                                        Phone.paginate({},{page: param.pageNum, limit: param.pageSize},function (err, phone) {
                                                                            if (err) {
                                                                                res.status(400).json({
                                                                                    success: false,
                                                                                    message: err
                                                                                });
                                                                            } else {
                                                                                if (!phone) {
                                                                                    res.status(400).json({
                                                                                        success: false,
                                                                                        message: 'No product was found'
                                                                                    });
                                                                                } else {
                                                                                    Rawmaterial.paginate({},{page: param.pageNum, limit: param.pageSize},function (err, rawmaterial) {
                                                                                        if (err) {
                                                                                            res.status(400).json({
                                                                                                success: false,
                                                                                                message: err
                                                                                            });
                                                                                        } else {
                                                                                            if (!rawmaterial) {
                                                                                                res.status(400).json({
                                                                                                    success: false,
                                                                                                    message: 'No product was found'
                                                                                                });
                                                                                            } else {
                                                                                                res.status(200).json({
                                                                                                    success: true,
                                                                                                    beauty,
                                                                                                    computer,
                                                                                                    electronics,
                                                                                                    fashion,
                                                                                                    manufacturing,
                                                                                                    phone,
                                                                                                    rawmaterial
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                    });
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }

                            }
                        });
                    }

                }
                // }

            })
        }
        else{
            res.status(400).json({success:false,message:"Invalid Page Request"});
        }
    });


    /*  BEGINNING OF GETTING ALL PRODUCTS IN A CATEGORY */

    router.get('/products/beauty', function (req, res) {
        beautyDao.getAllBeautyProducts(req,res);
    });

    router.get('/products/computer', function (req, res) {
        computerDao.getAllComputerProducts(req,res);
    });

    router.get('/products/electronics', function (req, res) {
        electronicsDao.getAllElectronicProducts(req,res);
    });

    router.get('/products/fashion', function (req, res) {
        fashionDao.getAllFashionProducts(req, res)
    });

    router.get('/products/manufacturing', function (req, res) {
        manufacturingDao.getAllManufacturingProducts(req,res);
    });

    router.get('/products/phone', function (req, res) {
        phoneDao.getAllPhoneProducts(req,res);
    });

    router.get('/products/rawmaterial', function (req, res) {
        rawDao.getAllRawMaterialProducts(req,res)
    });



    /* BEGINNING OF SEARCH FOR A PARTICULAR PRODUCT BY ID */

    //Endpoint to Get a particular product by ID

    router.get('/products/beauty/:id', function (req, res) {
        Beauty.findOne({_id: req.params.id}, function (err, products) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!products) {
                    res.status(400).json({success: false, message: 'No product was found'});
                } else {
                    if (products.length == 0) {
                        res.status(400).json({success: false, message: 'No product was found'});
                    } else {
                        res.status(200).json({success: true, product: products});
                    }

                }
            }
        })
    });

    router.get('/products/computer/:id', function (req, res) {
        Computer.findOne({_id: req.params.id}, function (err, products) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!products) {
                    res.status(400).json({success: false, message: 'No product was found'});
                } else {
                    if (products.length == 0) {
                        res.status(400).json({success: false, message: 'No product was found'});
                    } else {
                        res.status(200).json({success: true, product: products});
                    }

                }
            }
        })
    });

    router.get('/products/electronics/:id', function (req, res) {
        Electronics.findOne({_id: req.params.id}, function (err, products) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!products) {
                    res.status(400).json({success: false, message: 'No product was found'});
                } else {
                    if (products.length == 0) {
                        res.status(400).json({success: false, message: 'No product was found'});
                    } else {
                        res.status(200).json({success: true, product: products});
                    }

                }
            }
        })
    });

    router.get('/products/fashion/:id', function (req, res) {
        Fashion.findOne({_id: req.params.id}, function (err, products) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!products) {
                    res.status(400).json({success: false, message: 'No product was found'});
                } else {
                    if (products.length == 0) {
                        res.status(400).json({success: false, message: 'No product was found'});
                    } else {
                        res.status(200).json({success: true, product: products});
                    }

                }
            }
        })
    });

    router.get('/products/manufacturing:id', function (req, res) {
        Manufacturing.findOne({_id: req.params.id}, function (err, products) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!products) {
                    res.status(400).json({success: false, message: 'No product was found'});
                } else {
                    if (products.length == 0) {
                        res.status(400).json({success: false, message: 'No product was found'});
                    } else {
                        res.status(200).json({success: true, product: products});
                    }

                }
            }
        })
    });

    router.get('/products/phone/:id', function (req, res) {
        Phone.findOne({_id: req.params.id}, function (err, products) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!products) {
                    res.status(400).json({success: false, message: 'No product was found'});
                } else {
                    if (products.length == 0) {
                        res.status(400).json({success: false, message: 'No product was found'});
                    } else {
                        res.status(200).json({success: true, product: products});
                    }

                }
            }
        })
    });

    router.get('/products/rawmaterial/:id', function (req,res) {
        Rawmaterial.find({ _id: req.params.id}, function (err, products) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!products) {
                    res.status(400).json({success: false, message: 'No product was found'});
                } else {
                    if (products.length == 0) {
                        res.status(400).json({success: false, message: 'No product was found'});
                    } else {
                        res.status(200).json({success: true, product: products});
                    }

                }
            }
        })
    });




    /*  BEGINNING OF SEARCH ENDPOINT BY PRODUCT NAME*/
    //endpoint to search all categories
    router.get('/product/search/:searchTerm?',(req,res)=>{
        baseRequest.searchAllCategoriesForProduct(req,res).then(result=>{
            if(result.length > 0)
                res.status(200).json({success:true,message:"Match Found",result});
            else{
                res.status(200).json({success:true,message:"No Product Matching search"});
            }
        });
    });

    //Endpoint to Get a Beauty product by productName

    router.get('/product/search/beauty/:name?', function (req, res) {
        beautyDao.searchBeautyProducts(req,res);
    });

    //Endpoint to Get a computer product by productName

    router.get('/product/search/computer/:name?', function (req, res) {
        computerDao.searchComputerProducts(req,res);
    });

    //Endpoint to Get a electronics product by productName

    router.get('/product/search/electronics/:name?', function (req, res) {
        electronicsDao.searchElectronicProducts(req,res);
    });

    //Endpoint to Get a fashion product by productName

    router.get('/product/search/fashion/:name?', function (req, res) {
        fashionDao.searchFashionProducts(req, res);
    });

    //Endpoint to Get a manufacturing product by productName

    router.get('/product/search/Manufacturing/:name?', function (req, res) {
        manufacturingDao.searchManufacturingProducts(req,res);
    });

    //Endpoint to Get a phone product by productName

    router.get('/product/search/phone/:name?', function (req, res) {
        phoneDao.searchPhoneProducts(req,res);
    });

    //Endpoint to Get a rawmaterial product by productName

    router.get('/product/search/rawmaterial/:name?', function (req, res) {
        rawDao.searchRawMaterialProducts(req,res);
    });


    //Endpoint to get a particular user

    router.get('/user/:id', function (req, res) {
        User.findOne({id: req.params.id}, function (err, user) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!user) {
                    res.status(400).json({success: false, message: 'User was not found'});
                } else {
                    res.status(200).json({success: false, user: user});
                }
            }
        });
    });

    /* BEGINNING OF ALL ENDPOINTS THAT REQUIRE TOKEN */

    // setting up the token for the Customer on login

    const tokenChecker = function (req, res, next) {
        var token = req.headers['authorization'];
        if (!token) {
            res.status(400).json({success: false, message: 'No token provided'});
        } else {
            token = token.replace(/^Bearer\s/, '');
            jwt.verify(token, config.secretKey, function (err, decoded) {
                if (err) {
                    res.status(400).json({success: false, message: 'token invalid: ' + err});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    };

    /*router.use(function (req, res, next) {
          const token = req.headers['authorization'];
          if (!token){
              res.status(400).json({ success: false, message: 'No token provided' });
          } else {
              jwt.verify(token, config.secretKey, function(err, decoded) {
                  if (err) {
                      res.status(400).json({ success: false, message: 'token invalid: ' +err });
                  } else {
                      req.decoded = decoded;
                      next();
                  }
              });
          }
      });*/

    //Customer update information functionality

    router.put('/user/update/:id', tokenChecker, function (req, res) {
        if (!req.body.email) {
            res.status(400).json({success: false, message: 'Email is required'});
        } else {
            if (!req.body.firstname) {
                res.status(400).json({success: false, message: 'First name is required'});
            } else {
                if (!req.body.lastname) {
                    res.status(400).json({success: false, message: 'Last name is required'});
                } else {
                    if (!req.body.billingAddress1) {
                        res.status(400).json({success: false, message: 'Billing address must be provided'});
                    }
                    else {
                        User.findByIdAndUpdate(req.params.id, {
                            email: req.body.email,
                            firstname: req.body.firstname,
                            lastname: req.body.lastname,
                            billingAddress1: req.body.billingAddress1,
                            billingAddress2: req.body.billingAddress2,
                            phoneNumber: req.body.phoneNumber

                        }, function (err, user) {
                            if (err) {
                                res.status(500).json({
                                    success: false,
                                    message: 'User Information could not be updated' + err
                                });
                            } else {
                                res.status(200).json({
                                    success: true, message: 'User Information Updated', user: {
                                        id: user._id,
                                        email: user.email,
                                        firstname: user.firstname,
                                        lastname: user.lastname,
                                        phoneNumber: user.phoneNumber,
                                        billingAddress1: user.billingAddress1,
                                        billingAddress2: user.billingAddress2
                                    }
                                });
                            }
                        });
                    }
                }

            }

        }
    });

    //customer update password
    router.put('/user/update-password/:id', tokenChecker, function (req, res) {
        if (!req.body.newPassword) {
            res.status(400).json({success: false, message: 'New Password is required'});
        } else if (!req.body.oldPassword) {
            res.status(400).json({success: false, message: 'Old Password is required'});
        }
        else {
            const userId = req.params.id;
            const oldPassword = req.body.oldPassword;
            let newPassword = req.body.newPassword;
            User.findOne({_id: userId}).exec().then(function (user) {
                if (user) {
                    // verify old password entered by user matches saved in db
                    user.comparePassword(oldPassword, function (err, isMatch) {
                        if (err || !isMatch) {
                            res.status(400).json({success: false, message: 'Incorrect Old Password Entered'});
                        } else {
                            //hash the new password bf saving
                            user.hashPassword(newPassword, (data) => {
                                if (!data.success) {
                                    res.status(500).json({success: false, message: data.error});
                                } else {
                                    newPassword = data.hashedPassword;
                                    User.findByIdAndUpdate(userId, {
                                        password: newPassword
                                    }, function (err, user) {
                                        if (err) {
                                            res.status(500).json({
                                                success: false,
                                                message: 'Password could not be updated' + err
                                            });
                                        } else {
                                            console.log(JSON.stringify(user));
                                            res.status(200).json({success: true, message: 'Password Updated'});
                                        }
                                    });
                                }

                            })
                        }
                    });
                } else {
                    res.status(400).json({success: false, message: "User Not found"});
                }
            }).catch(function (err) {
                res.status(500).json({success: false, message: err})
            })
        }
    });


    //Endpoint to add User Cart based on the productID and category

    router.post('/userCart/', tokenChecker, function (req, res) {
        if (cartDao.validateRequest(req, res)) {
            cartDao.createCart(req, res);
        }
    });

    //Endpoint to  to get User Cart

    // Using productID you can get the product itself by using the get product using ID end point

    router.get('/userCart/:userId/:cartType', tokenChecker, function (req, res) {
        cartDao.getCart(req, res).then(function (result) {
            res.status(200).json({success: true, result})
        })
            .catch(function (err) {
                res.status(err.code).json({success: false, message: err.message})
            });
    });

    //Endpoint to Update User cart - Quantity

    router.put('/userCart/:userId/:category/:productId', tokenChecker, function (req, res) {

        if (cartDao.validateUpdateCartRequest(req, res)) {
            cartDao.updateCart(req, res);
        }
    });

    //endpoint to update cart type
    router.put('/userCartType/:userId/', tokenChecker, function (req, res) {
        if (cartDao.validateUpdateCartTypeRequest(req, res)) {
            cartDao.updateCartType(req, res);
        }
    });

    //Endpoint to Update User cart - Status

    router.put('/updateUserCartStatus/:userEmail?/:category?/:productID?', tokenChecker, function (req, res) {
        UserCart.findOne({
            userEmail: req.query.userEmail,
            category: req.query.category,
            productID: req.query.productID
        }, function (err, userCart) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!req.body.status) {
                    res.status(500).json({success: false, message: 'Quantity of product to be updated is required'});
                } else {
                    var cartID = userCart._id;
                    UserCart.findByIdAndUpdate(cartID, {
                        status: req.body.status
                    }, function (err) {
                        if (err) {
                            res.status(400).json({success: false, message: 'Cart could not be updated'});
                        } else {
                            res.status(200).json({success: true, message: 'Cart has been Updated'});
                        }
                    });
                }
            }
        });
    });

    //Endpoint to Delete a userCart

    router.delete('/userCart/:userId/:category/:productId', tokenChecker, function (req, res) {
        cartDao.removeProductFromCart(req, res);
    });

    //Create comment by user Endpoint

    router.post('/review/:userEmail?/:category?/:productID?', tokenChecker, function (req, res) {
        if (!req.query.productID) {
            res.status(400).json({success: false, message: 'Product ID is required'});
        } else {
            if (!req.body.review) {
                res.status(400).json({success: false, message: 'Reivew is required'});
            } else {
                if (!req.body.numberOfStars) {
                    res.status(400).json({success: false, message: 'Rating is required'});
                } else {
                    let review = new Review({
                        userEmail: req.query.userEmail,
                        category: req.query.category,
                        productID: req.query.productID,
                        review: req.body.review,
                        numberOfStars: req.body.numberOfStars,
                        createdAt: Date.now()
                    });
                    review.save(function (err) {
                        if (err) {
                            res.status(500).json({success: false, message: err});
                        } else {
                            res.status(400).json({success: true, message: 'Review has been saved'});
                        }
                    });
                }
            }
        }
    });


    //Endpoint to get reviews for a product

    router.get('/review/:category?/:productID?', tokenChecker, function (req, res) {
        Review.find({category: req.query.category, productID: req.query.productID}, function (err, review) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!review) {
                    res.status(400).json({success: false, message: 'No reivew was found for this user'});
                } else {
                    res.status(200).json({success: true, review: review});
                }
            }
        })
    });

    //  Endpoint to get reviews for a single user

    router.get('/getreview/:userEmail', tokenChecker, function (req, res) {
        Review.find({userEmail: req.params.userEmail}, function (err, review) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!review) {
                    res.status(400).json({success: false, message: 'No reivew was found for this user'});
                } else {
                    res.status(200).json({success: true, review: review});
                }
            }
        })
    });

    // Endpoint to get all reviews
    router.get('/allreview', tokenChecker, function (req, res) {
        Review.find({}, function (err, review) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!review) {
                    res.status(400).json({success: false, message: 'No reivew was found for this user'});
                } else {
                    res.status(200).json({success: true, review: review});
                }
            }
        })
    });


    /* BEGINNING OF ORDER API */
    // router.post('/order/:userId', tokenChecker, function (req, res) {
    //     if (!req.params.userId) {
    //         res.status(400).json({success: false, message: "User Id is required"});
    //     } else {
    //         if (!req.body.paymentType) {
    //             res.status(400).json({success: false, message: "Payment type is required"});
    //         } else {
    //             // var userEmail = req.body.userEmail;
    //             var status = "PENDING";
    //             UserCart.find({userId: req.params.userId, status: status}, function (err, carts) {
    //                 if (err) {
    //                     res.status(500).json({success: false, message: err});
    //                 } else {
    //                     if (!carts) {
    //                         res.status(404).json({success: false, message: "You have no product in your cart"});
    //                     } else {
    //                         var newStatus = "DONE";
    //                         UserCart.update({
    //                             userId: req.params.userId,
    //                             status: status
    //                         }, {status: newStatus}, {multi: true}, function (err, answer) {
    //                             if (err) {
    //                                 res.status(500).json({success: false, message: err});
    //                             } else {
    //                                 const orderCode = randomstring.generate(10);
    //                                 const name = req.body.name;
    //                                 const paymentId = req.body.paymentID || "PayOnDeliveryID";
    //                                 var newStatus1 = "DONE";
    //                                 const paymentType = req.body.paymentType;
    //                                 UserCart.find({
    //                                     userId: req.params.userId,
    //                                     status: newStatus1
    //                                 }, function (err, newCart) {
    //                                     let order = new Order({
    //                                         name: name,
    //                                         userId: req.params.userId,
    //                                         orderCode: orderCode,
    //                                         paymentID: paymentId,
    //                                         paymentType: paymentType,
    //                                         userCart: newCart
    //                                     });
    //                                     order.save(function (err) {
    //                                         if (err) {
    //                                             res.status(500).json({success: false, message: err});
    //                                         }
    //                                     });
    //                                     res.status(200).json({
    //                                         success: true, message: "Order was successfully placed", orderInfo: {
    //                                             name: name,
    //                                             userId: req.params.userId,
    //                                             orderCode: orderCode,
    //                                             paymentID: paymentId,
    //                                             paymentType: paymentType,
    //                                             userCart: newCart
    //                                         }
    //                                     });
    //                                 });
    //                             }
    //                         });
    //                     }
    //                 }
    //             })
    //
    //         }
    //     }
    // });
    router.post('/order/:userId', tokenChecker, function (req, res) {
        if(orderDao.validateCreateOrderRequest(req,res)){
            orderDao.createOrderRequest(req,res).then(result=>{
                res.status(200).json(result)
            }).catch(err=>{
                res.status(err.code).json(err.message);
            })

        }
    });

    // get all users orders
    router.get('/order/:userId',tokenChecker,(req,res)=>{
        if (!req.params.userId) {
            res.status(400).json({success: false, message: "User Id is required"});
        }else{
            const userId = req.params.userId;
            Order.paginate({userId:userId},{page: req.params.pageNum || 1, limit:req.params.pageSize||10})
                .then(result=>{
                    return res.status(200).json(result)
                }).catch(err=>{
                return res.status(500).json(error);
            })
        }
    });

    return router;

};
