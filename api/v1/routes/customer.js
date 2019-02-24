const mongoose = require('mongoose');
const User = require('../models/user');
const Products = require('../models/products');
const Manufacturing = require('../models/ManufacturingProduct');
const Beauty = require('../models/BeautyProduct');
const Computer = require('../models/ComputerProduct');
const Electronics = require('../models/ElectronicsProduct');
const Fashion = require('../models/FashionProduct');
const Phone = require('../models/PhonesProduct');
const Rawmaterial = require('../models/RawmaterialProduct');
const Review = require('../models/review');
const Order = require('../models/order');
const UserCart = require('../models/userCart');
const config = require('../config/secret');
const jwt = require('jsonwebtoken');
const moment = require('moment');
var randomstring = require("randomstring");


module.exports = function(router){

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
                        if (!req.body.billingAddress1) {
                            res.status(400).json({success: false, message: 'Billing address must be provided'});
                        } else {
                            if (!req.body.phoneNumber) {
                                res.status(400).json({success: false, message: 'Phone number is required'});
                            }
                            else {
                                var user = new User({
                                    email: req.body.email,
                                    password: req.body.password,
                                    firstname: req.body.firstname,
                                    lastname: req.body.lastname,
                                    billingAddress1: req.body.billingAddress1,
                                    billingAddress2: req.body.billingAddress2,
                                    phoneNumber: req.body.phoneNumber
                                });
                                user.save(function (err) {
                                    if (err) {
                                        if (err.code === 11000) {
                                            res.status(400).json({success: false, message: 'E-mail already exists'});
                                        } else {
                                            if (err.errors) {
                                                if (err.errors.email) {
                                                    res.status(400).json({success: false, message: err.errors.email.message });
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
                                                            res.status(400).json({ success: false, message: err });
                                                        }
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
                    }
                }
            }
        }
    });


    // logging api functionality
    router.post('/user/login', function(req,res){
        if (!req.body.email){
            res.status(400).json({ success: false, message: 'Email must be provided'});
        } else {
            if (!req.body.password){
                res.status(400).json({ success: false, message: 'No password was provided'});
            } else {
                User.findOne({ email: req.body.email}, function (err,user) {
                    if (err){
                        res.status(500).json({ success: false, message: 'An error occurred'});
                    } else {
                        if (!user){
                            res.status(400).json({ success: false, message: 'User was not found.'});
                        } else {
                            const validPassword = user.comparePassword(req.body.password);
                            if (!validPassword){
                                res.status(400).json ({ success: false, message: 'Password was invalid' });
                            } else {
                                const token = jwt.sign({ userId: user._id}, config.secretKey, {expiresIn: '5h'});
                                res.status(200).json({ success: true, message: 'Success!', token: token, user: {
                                        id: user._id,
                                        email: user.email
                                    }});
                            }
                        }
                    }
                });
            }
        }
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
    router.get('/products/search/manufacturing/:date?', function (req,res) {
        Manufacturing.find({ date: req.query.date }, function (err, products) {
            if(err){
                res.status(500).json({ success: false, message: err });
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

    router.get('/getallproducts', function (req,res) {
        Beauty.find({}, function (err, beauty) {
            if (err) {
                res.status(400).json({success: false, message: err});
            } else {
                if (!beauty) {
                    res.status(400).json({success: false, message: 'No product was found'});
                } else {
                    // if (products.length == 0) {
                    //     res.status(400).json({success: false, message: 'No product was found'});
                    // } else {
                        Computer.find({}, function (err, computer) {
                            if (err) {
                                res.status(400).json({success: false, message: err});
                            } else {
                                if (!computer) {
                                    res.status(400).json({success: false, message: 'No product was found'});
                                } else {
                                    Electronics.find({}, function (err, electronics) {
                                       if (err) {
                                           res.status(400).json({success: false, message: err});
                                       }  else {
                                           if (!electronics) {
                                               res.status(400).json({success: false, message: 'No product was found'});
                                           } else {
                                               Fashion.find({}, function (err, fashion) {
                                                   if (err) {
                                                       res.status(400).json({success: false, message: err});
                                                   } else {
                                                       if (!fashion) {
                                                           res.status(400).json({success: false, message: 'No product was found'});
                                                       } else {
                                                           Manufacturing.find({}, function (err, manufacturing) {
                                                               if (err) {
                                                                   res.status(400).json({success: false, message: err});
                                                               } else {
                                                                   if (!manufacturing) {
                                                                       res.status(400).json({success: false, message: 'No product was found'});
                                                                   } else {
                                                                       Phone.find({}, function (err, phone) {
                                                                           if (err) {
                                                                               res.status(400).json({success: false, message: err});
                                                                           } else {
                                                                               if (!phone) {
                                                                                   res.status(400).json({success: false, message: 'No product was found'});
                                                                               } else {
                                                                                   Rawmaterial.find({}, function (err, rawmaterial) {
                                                                                       if (err) {
                                                                                           res.status(400).json({success: false, message: err});
                                                                                       } else {
                                                                                           if (!rawmaterial) {
                                                                                               res.status(400).json({success: false, message: 'No product was found'});
                                                                                           } else {
                                                                                               res.status(200).json({success: true, beauty, computer, electronics, fashion, manufacturing, phone, rawmaterial});
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
    });


    /*  BEGINNING OF GETTING ALL PRODUCTS IN A CATEGORY */

    router.get('/products/beauty', function (req,res) {
       Beauty.find({}, function (err, products) {
           if (err) {
               res.status(400).json({success: false, message: err});
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

       })
    });

    router.get('/products/computer', function (req,res) {
        Computer.find({}, function (err, products) {
            if (err) {
                res.status(400).json({success: false, message: err});
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

        })
    });

    router.get('/products/electronics', function (req,res) {
        Electronics.find({}, function (err, products) {
            if (err) {
                res.status(400).json({success: false, message: err});
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

        })
    });

    router.get('/products/fashion', function (req,res) {
        Fashion.find({}, function (err, products) {
            if (err) {
                res.status(400).json({success: false, message: err});
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

        })
    });

    router.get('/products/manufacturing', function (req,res) {
        Manufacturing.find({}, function (err, products) {
            if (err) {
                res.status(400).json({success: false, message: err});
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

        })
    });

    router.get('/products/phone', function (req,res) {
        Phone.find({}, function (err, products) {
            if (err) {
                res.status(400).json({success: false, message: err});
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

        })
    });

    router.get('/products/rawmaterial', function (req,res) {
        Rawmaterial.find({}, function (err, products) {
            if (err) {
                res.status(400).json({success: false, message: err});
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

        })
    });

    /* BEGINNING OF SEARCH FOR A PARTICULAR PRODUCT BY ID */

    //Endpoint to Get a particular product by ID

    router.get('/products/beauty/:id', function (req,res) {
        Beauty.find({ _id: req.params.id}, function (err, products) {
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
        })
    });

    router.get('/products/computer/:id', function (req,res) {
        Computer.find({ _id: req.params.id}, function (err, products) {
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
        })
    });

    router.get('/products/electronics/:id', function (req,res) {
        Electronics.find({ _id: req.params.id}, function (err, products) {
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
        })
    });

    router.get('/products/fashion/:id', function (req,res) {
        Fashion.find({ _id: req.params.id}, function (err, products) {
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
        })
    });

    router.get('/products/manufacturing:id', function (req,res) {
        Manufacturing.find({ _id: req.params.id}, function (err, products) {
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
        })
    });

    router.get('/products/phone/:id', function (req,res) {
        Phone.find({ _id: req.params.id}, function (err, products) {
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
        })
    });

    router.get('/products/rawmaterial:id', function (req,res) {
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
                        res.status(200).json({success: true, listOfProductCategory: products});
                    }

                }
            }
        })
    });




    /*  BEGINNING OF SEARCH ENDPOINT BY PRODUCT NAME*/

    //Endpoint to Get a Beauty product by productName

    router.get('/product/search/beauty/:name?', function (req,res) {
        var pname = req.query.name;
        // var category = req.query.category;
        Beauty.find({name: pname}, function (err, products) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                if (!products) {
                    res.json({success: false, message: 'No product was found'});
                }
                else {
                    if (products.length == 0) {
                        res.json({success: false, message: 'No product was found'});
                    }
                    else {
                        res.json({success: true, listOfProductCategory: products});
                    }

                }
            }
        })
    });

    //Endpoint to Get a computer product by productName

    router.get('/product/search/computer/:name?', function (req,res) {
        var pname = req.query.name;
        // var category = req.query.category;
        Computer.find({name: pname}, function (err, products) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                if (!products) {
                    res.json({success: false, message: 'No product was found'});
                }
                else {
                    if (products.length == 0) {
                        res.json({success: false, message: 'No product was found'});
                    }
                    else {
                        res.json({success: true, listOfProductCategory: products});
                    }

                }
            }
        })
    });

    //Endpoint to Get a electronics product by productName

    router.get('/product/search/electronics/:name?', function (req,res) {
        var pname = req.query.name;
        // var category = req.query.category;
        Electronics.find({name: pname}, function (err, products) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                if (!products) {
                    res.json({success: false, message: 'No product was found'});
                }
                else {
                    if (products.length == 0) {
                        res.json({success: false, message: 'No product was found'});
                    }
                    else {
                        res.json({success: true, listOfProductCategory: products});
                    }

                }
            }
        })
    });

    //Endpoint to Get a fashion product by productName

    router.get('/product/search/fashion/:name?', function (req,res) {
        var pname = req.query.name;
        // var category = req.query.category;
        Fashion.find({name: pname}, function (err, products) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                if (!products) {
                    res.json({success: false, message: 'No product was found'});
                }
                else {
                    if (products.length == 0) {
                        res.json({success: false, message: 'No product was found'});
                    }
                    else {
                        res.json({success: true, listOfProductCategory: products});
                    }

                }
            }
        })
    });

    //Endpoint to Get a manufacturing product by productName

    router.get('/product/search/Manufacturing/:name?', function (req,res) {
        var pname = req.query.name;
        // var category = req.query.category;
        Manufacturing.find({name: pname}, function (err, products) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                if (!products) {
                    res.json({success: false, message: 'No product was found'});
                }
                else {
                    if (products.length == 0) {
                        res.json({success: false, message: 'No product was found'});
                    }
                    else {
                        res.json({success: true, listOfProductCategory: products});
                    }

                }
            }
        })
    });

    //Endpoint to Get a phone product by productName

    router.get('/product/search/phone/:name?', function (req,res) {
        var pname = req.query.name;
        // var category = req.query.category;
        Phone.find({name: pname}, function (err, products) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                if (!products) {
                    res.json({success: false, message: 'No product was found'});
                }
                else {
                    if (products.length == 0) {
                        res.json({success: false, message: 'No product was found'});
                    }
                    else {
                        res.json({success: true, listOfProductCategory: products});
                    }

                }
            }
        })
    });

    //Endpoint to Get a rawmaterial product by productName

    router.get('/product/search/rawmaterial/:name?', function (req,res) {
        var pname = req.query.name;
        // var category = req.query.category;
        Rawmaterial.find({name: pname}, function (err, products) {
            if (err) {
                res.json({success: false, message: err});
            } else {
                if (!products) {
                    res.json({success: false, message: 'No product was found'});
                }
                else {
                    if (products.length == 0) {
                        res.json({success: false, message: 'No product was found'});
                    }
                    else {
                        res.json({success: true, listOfProductCategory: products});
                    }

                }
            }
        })
    });




    //Endpoint to get a particular user

    router.get('/user/:id', function (req, res) {
        User.findOne({ id: req.params.id}, function (err, user) {
            if (err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!user) {
                    res.status(400).json({success: false, message: 'User was not found'});
                } else {
                    res.status(200).json({ success: false, user: user});
                }
            }
        }) ;
    });

    /* BEGINNING OF ALL ENDPOINTS THAT REQUIRE TOKEN */

    // setting up the token for the Customer on login

    const tokenChecker = function (req, res, next) {
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
            if (!req.body.password) {
                res.status(400).json({success: false, message: 'Password is required'});
            } else {
                if (!req.body.firstname) {
                    res.status(400).json({success: false, message: 'First name is required'});
                } else {
                    if (!req.body.lastname) {
                        res.status(400).json({success: false, message: 'Last name is required'});
                    } else {
                        if (!req.body.billingAddress1) {
                            res.status(400).json({success: false, message: 'Billing address must be provided'});
                        } else {
                            if (!req.body.phoneNumber) {
                                res.status(400).json({success: false, message: 'Phone number is required'});
                            }
                            else {
                                User.findByIdAndUpdate(req.params.id, {
                                    email: req.body.email,
                                    password: req.body.password,
                                    firstname: req.body.firstname,
                                    lastname: req.body.lastname,
                                    billingAddress1: req.body.billingAddress1,

                                    // I am not sure if users would be updating all information so I didn't add this

                                    // billingAddress2: req.body.billingAddress2,

                                    phoneNumber: req.body.phoneNumber

                                }, function (err) {
                                    if (err) {
                                        res.status(400).json({success: false, message: 'User Information could not be updated'});
                                    } else {
                                        res.status(200).json({success: true, message: 'User Information Updated'});
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    });

    //Endpoint to add User Cart based on the productID and category

    router.post('/userCart/:userEmail?/:category?/:productID?', tokenChecker, function (req, res) {
        var status = "PENDING";
        var userCart = new UserCart({
            userEmail: req.query.userEmail,
            productID: req.query.productID,
            category: req.query.category,
            quantity: req.body.quantity,
            status: status
        });
        userCart.save(function (err) {
            if (err) {
                res.status(500).json({success:false, message: err});
            } else {
                res.status(200).json({success: true, message: 'Item has been added to cart'});
            }
        });
    });

    //Endpoint to  to get User Cart

    // Using productID you can get the product itself by using the get product using ID end point

    router.get('/userCart/:userEmail', tokenChecker, function (req,res) {
        UserCart.find({userEmail: req.params.userEmail}, function (err, userCart) {
            if (err) {
                res.status(400).json({success: false, message: err});
            } else {
                if (!userCart) {
                    res.status(400).json({success: false, message: "User's cart does not exist"});
                }
                else {
                    if (userCart.length == 0) {
                        res.status(400).json({success: false, message: "No product in the user's cart"});
                    }
                    else {
                        res.status(200).json({success: true, userCart: userCart});
                    }

                }
            }
        }) ;
    });

    //Endpoint to Update User cart - Quantity

    router.put('/updateUserCartQuantity/:userEmail?/:category?/:productID?', tokenChecker, function (req, res) {
        UserCart.findOne({userEmail: req.query.userEmail, category: req.query.category, productID:req.query.productID}, function (err,userCart) {
            if(err) {
                res.status(500).json({success: false, message: err});
            } else {
                if (!req.body.quantity) {
                    res.status(500).json({success: false, message: 'Quantity of product to be updated is required'});
                } else {
                    var cartID = userCart._id;
                    UserCart.findByIdAndUpdate(cartID, {
                        quantity: req.body.quantity
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

    //Endpoint to Update User cart - Status

    router.put('/updateUserCartStatus/:userEmail?/:category?/:productID?', tokenChecker, function (req, res) {
        UserCart.findOne({userEmail: req.query.userEmail, category: req.query.category, productID:req.query.productID}, function (err,userCart) {
            if(err) {
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

    router.delete('/userCart/:userEmail?/:category?/:productID?', tokenChecker, function (req,res) {
        UserCart.findOne({userEmail: req.query.userEmail, productID:req.query.productID, category:req.query.category}, function (err,cart) {
            if(err) {
                res.status(500).json({success: false, message: err});
            }else {
                var cartID = cart._id;
                UserCart.findByIdAndRemove({_id: cartID}).then(function (done) {
                    if (done) {
                        res.status(400).json({success: true, message: 'Cart was successfully deleted'});
                    } else {
                        res.status(200).json({success: false, message: 'An error occurred. Try again later.'});
                    }

                });
            }
        });
    });

    //Create comment by user Endpoint

    router.post('/review/:userEmail?/:category?/:productID?', tokenChecker, function (req, res) {
        if(!req.query.productID) {
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

    router.get('/review/:category?/:productID?', tokenChecker, function(req, res) {
        Review.find({category: req.query.category, productID: req.query.productID}, function (err, review) {
            if (err){
                res.status(500).json({success:false, message: err});
            } else {
                if (!review){
                    res.status(400).json({success: false, message: 'No reivew was found for this user'});
                } else {
                    res.status(200).json({success: true, review: review});
                }
            }
        })
    });

    //  Endpoint to get reviews for a single user

    router.get('/getreview/:userEmail', tokenChecker, function(req, res) {
        Review.find({userEmail: req.params.userEmail}, function (err, review) {
            if (err){
                res.status(500).json({success:false, message: err});
            } else {
                if (!review){
                    res.status(400).json({success: false, message: 'No reivew was found for this user'});
                } else {
                    res.status(200).json({success: true, review: review});
                }
            }
        })
    });

    // Endpoint to get all reviews
    router.get('/allreview', tokenChecker, function(req, res) {
        Review.find({}, function (err, review) {
            if (err){
                res.status(500).json({success:false, message: err});
            } else {
                if (!review){
                    res.status(400).json({success: false, message: 'No reivew was found for this user'});
                } else {
                    res.status(200).json({success: true, review: review});
                }
            }
        })
    });


    /* BEGINNING OF ORDER API */

    router.post('/order/:userEmail', tokenChecker, function (req, res) {
       if (!req.params.userEmail) {
           res.status(500).json({ success: false, message: "User email is required"});
       } else {
           if (!req.body.paymentID) {
               res.status(500).json({ success: false, message: "Payment ID is required" });
           } else {
               // var userEmail = req.body.userEmail;
               var status = "PENDING";
               UserCart.find({userEmail: req.params.userEmail, status: status}, function (err, carts) {
                   if (err) {
                       res.status(500).json({ success: false, message: err });
                   } else {
                       if (!carts) {
                           res.status(500).json({ success: false, message: "You have no product in your cart" });
                       } else {
                            var newStatus = "DONE";
                           UserCart.update({userEmail: req.params.userEmail, status: status}, { status: newStatus }, { multi: true }, function (err, answer) {
                               if (err) {
                                   res.status(500).json({ success: false, message: err });
                               } else {
                                   var newStatus1 = "DONE";
                                   UserCart.find({userEmail: req.params.userEmail, status: newStatus1}, function (err, newCart) {
                                       let order = new Order({
                                           userEmail: req.params.userEmail,
                                           orderCode: randomstring.generate(10),
                                           paymentID: req.query.paymentID,
                                           userCart: newCart
                                       });
                                       order.save(function (err) {
                                           if (err) {
                                               res.status(500).json({success: false, message: err});
                                           } else {
                                               res.status(200).json({success: true, message: 'Order has been saved'});
                                           }
                                       });
                                       res.status(200).json({ success: true, message: "Order was successfully placed", userCart: newCart });
                                   });
                               }
                           });
                       }
                   }
               })

           }
       }
    });

    return router;

};
