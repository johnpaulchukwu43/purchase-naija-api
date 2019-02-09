const mongoose = require('mongoose');
const User = require('../models/user');
const Products = require('../models/products');
const Review = require('../models/review');
const UserCart = require('../models/userCart');
const config = require('../config/secret');
const jwt = require('jsonwebtoken');

module.exports = function(router){

    // register api
    router.post('api/v1/user/signup', function (req, res) {
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
    router.post('api/v1/user/login', function(req,res){
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

    //Customer update information functionality

    router.put('api/v1/user/update/:id', function (req, res) {
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

    // searching for products based on category
    router.get('api/v1/products/search/:productCategory', function (req,res) {
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
    });

// searching for service provider based on category and date
    router.get('api/v1/products/search/:productCategory?/:date?', function (req,res) {
        Products.find({ productCategory: req.query.productCategory, date: req.query.date }, function (err, products) {
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

    //Endpoint to get all products
    router.get('api/v1/products', function (req,res) {
       Products.find({}, function (err, products) {
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

    //Endpoint to Get a particular product by ID

    router.get('api/v1/products/:id', function (req,res) {
        Products.find({ _id: req.params.id}, function (err, products) {
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

    //Endpoint to Get a particular product by productName
    router.get('api/v1/product/search/:name?', function (req,res) {
        var pname = req.query.name;
        Products.find({name: pname}, function (err, products) {
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

    //Endpoint to add User Cart
    router.post('api/v1/userCart/:userEmail?/:productID?', function (req, res) {
        var status = "PENDING";
        var userCart = new UserCart({
            userEmail: req.query.userEmail,
            productID: req.query.productID,
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

    router.get('api/v1/userCart/:userEmail', function (req,res) {
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

    //Endpoint to Update User cart

    router.put('api/v1/userCart/:userEmail?/:productID?', function (req, res) {
        UserCart.findOne({userEmail: req.query.userEmail, productID:req.query.productID}, function (err,cart) {
            if(err) {
                res.status(500).json({success: false, message: err});
            }else {
                var cartID = cart._id;
                UserCart.findByIdAndUpdate(cartID, {
                    userEmail: req.query.userEmail,
                    productID: req.query.productID,
                    quantity: req.body.quantity
                    // status: status
                }, function (err) {
                    if (err) {
                        res.status(400).json({success: false, message: 'Cart could not be updated'});
                    } else {
                        res.status(200).json({success: true, message: 'Cart has been Updated'});
                    }
                });
            }
        });
    });

    //Endpoint to Delete a userCart

    router.delete('api/v1/userCart/:userEmail?/:productID?', function (req,res) {
        UserCart.findOne({userEmail: req.query.userEmail, productID:req.query.productID}, function (err,cart) {
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

    router.post('api/v1/review/:userEmail', function (req, res) {
       if(!req.body.productID) {
            res.status(400).json({success: false, message: 'Product ID is required'});
       } else {
           if (!req.body.review) {
               res.status(400).json({success: false, message: 'Reivew is required'});
           } else {
               if (!req.body.numberOfStars) {
                   res.status(400).json({success: false, message: 'Rating is required'});
               } else {
                   let review = new Review({
                      userEmail: req.params.userEmail,
                      productID: req.body.productID,
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
    router.get('api/v1/review/:productID', function(req, res) {
        Review.find({productID: req.params.productID}, function (err, review) {
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
    router.get('api/v1/getreview/:userEmail', function(req, res) {
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
    router.get('/allreview', function(req, res) {
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


    //Endpoint to get a particular user

    router.get('api/v1/user/:id', function (req, res) {
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

    return router;
};