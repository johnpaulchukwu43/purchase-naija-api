const mongoose = require('mongoose');
const User = require('../models/user');
// const Products = require('../models/products');
const Manufacturing = require('../models/ManufacturingProduct');
const Beauty = require('../models/BeautyProduct');
const Computer = require('../models/ComputerProduct');
const Electronics = require('../models/ElectronicsProduct');
const Fashion = require('../models/FashionProduct');
const Phone = require('../models/PhonesProduct');
const Rawmaterial = require('../models/RawmaterialProduct');
const ServiceProvider = require('../models/serviceProvider');
const config = require('../config/secret');
const jwt = require('jsonwebtoken');
var randomstring = require("randomstring");
var moment = require('moment');


const multer = require('multer');

// set the directory for the uploads to the uploaded to
var DIR = './productImage';

//define the type of upload multer would be doing and pass in its destination, in our case, its a single file with the name photo
// var upload = multer({dest: DIR}).single('file');

// adding the storage for the pictures to be stored in
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,  DIR)
    },
    filename: function (req, file, cb) {
        var fileObj = {
            "image/png": ".png",
            "image/jpeg": ".jpeg"
            // "image/jpg": ".jpg"
        };
        if (fileObj[file.mimetype] == undefined) {
            cb(new Error("file format not valid"));
        } else {
            cb(null, file.fieldname + '-' + Date.now() + fileObj[file.mimetype])
        }
    }
});

var upload = multer({ storage: storage }).single('file');

module.exports = function(router){


    // register SP api
    router.post('/serviceProvider/signup', function (req, res) {
        if (!req.body.businessName) {
            res.status(400).json({success: false, message: 'Business Name is required'});
        } else {
            if (!req.body.email) {
                res.status(400).json({success: false, message: 'Email is required'});
            }else {
                if (!req.body.billingAddress) {
                    res.status(400).json({success: false, message: 'Billing Address is required'});
                } else {
                    if (!req.body.password) {
                        res.status(400).json({success: false, message: 'Password is required'});
                    } else {
                        if (!req.body.phoneNumber) {
                            res.status(400).json({success: false, message: 'Phone Number is required'});
                        } else {
                        var serviceProvider = new ServiceProvider({
                            businessName: req.body.businessName,
                            email: req.body.email,
                            billingAddress: req.body.billingAddress,
                            password: req.body.password,
                            phoneNumber: req.body.phoneNumber
                        });
                        serviceProvider.save(function (err) {
                            if (err) {
                                if (err.code === 11000) {
                                    res.status(400).json({success: false, message: 'Username already exists'});
                                } else {
                                    if (err.errors) {
                                        if (err.errors.businessName) {
                                            res.status(400).json({success: false, message: err.errors.businessName.message});
                                        } else {
                                            if (err.errors.password) {
                                                res.status(400).json({success: false, message: err.errors.password.message });
                                            } else {
                                                if (err.errors.email) {
                                                    res.status(400).json({success: false, message: err.errors.email.message });
                                                } else {
                                                    if (err.errors.phoneNumber) {
                                                        res.status(400).json({success: false, message: err.errors.phoneNumber.message})
                                                    } else {
                                                        res.status(400).json({success: false, message: err});
                                                    }
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
    });


    // logging api functionality
    router.post('/serviceProvider/login', function(req,res){
        if (!req.body.businessName){
            res.status(400).json({ success: false, message: 'Business Name must be provided'});
        } else {
            if (!req.body.password){
                res.status(400).json({ success: false, message: 'No password was provided'});
            } else {
                ServiceProvider.findOne({ businessName: req.body.businessName}, function (err,serviceProvider) {
                    if (err){
                        res.status(500).json({ success: false, message: 'An error occurred'});
                    } else {
                        if (!serviceProvider){
                            res.status(400).json({ success: false, message: 'User was not found.'});
                        } else {
                            const validPassword = serviceProvider.comparePassword(req.body.password);
                            if (!validPassword){
                                res.status(400).json ({ success: false, message: 'Password was invalid' });
                            } else {
                                const token = jwt.sign({ staffId: serviceProvider._id}, config.secretKey, {expiresIn: '5h'});
                                res.status(200).json({ success: true, message: 'Success!', token: token, serviceProvider: {
                                        id: serviceProvider._id
                                }});
                            }
                        }
                    }
                });
            }
        }
    });

    // setting up the token for the service provider on login
   /* router.use(function (req, res, next) {
        const token = req.headers['authorization'];
        if (!token){
            res.json({ success: false, message: 'No token provided' });
        } else {
            jwt.verify(token, config.secretKey, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'token invalid: ' +err });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        }
    });*/

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

    //Update user information

    router.put('/serviceProvider/:id', tokenChecker, function (req, res) {
        if (!req.body.businessName) {
            res.status(400).json({success: false, message: 'Business Name is required'});
        } else {
            if (!req.body.email) {
                res.status(400).json({success: false, message: 'Email is required'});
            }else {
                if (!req.body.billingAddress) {
                    res.status(400).json({success: false, message: 'Billing Address is required'});
                } else {
                    if (!req.body.password) {
                        res.status(400).json({success: false, message: 'Password is required'});
                    } else {
                        if (!req.body.phoneNumber) {
                            res.status(400).json({success: false, message: 'Phone Number is required'});
                        } else {
                            ServiceProvider.findByIdAndUpdate(req.params.id, {
                                businessName: req.body.businessName,
                                email: req.body.email,
                                billingAddress: req.body.billingAddress,
                                password: req.body.password,
                                phoneNumber: req.body.phoneNumber
                            }, function (err) {
                                if (err) {
                                    res.status(500).json({success: false, message: 'User Information could not be updated'});
                                } else {
                                    res.status(200).json({success: true, message: 'User Information Updated'});
                                }
                            });
                        }
                    }
                }
            }
        }
    });

    //API to get a particular user

    router.get('user/:id', tokenChecker, function (req, res) {
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

    //Create Products

    //Add Manufacturing Products

    router.post('/serviceProvider/products/manufacturing', tokenChecker, function (req, res) {
        if (!req.body.name) {
            res.status(400).json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message:'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message:'Description of the product is required'});
                } else {
                    if (!req.body.quantity){
                        res.status(400).json({success: false, message:'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message:'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {
                                if (!req.body.SubCategory) {
                                    res.status(400).json({success: false, message: 'Sub Category is required'});
                                } else {

                                    /*
                                                               var imagePath = '';

                                                               upload(req, res, function (err) {
                                                                   if (err) {
                                                                       // An error occurred when uploading
                                                                       console.log(err);
                                                                       return res.status(422).send("an Error occured");
                                                                   }*/
                                    // imagePath = req.file.filename;


                                    let manufacturing = new Manufacturing({
                                        name: req.body.name,
                                        serviceProdiver: req.body.serviceProdiver,
                                        price: req.body.price,
                                        description: req.body.description,
                                        productCode: randomstring.generate(10),
                                        imageUrl: req.body.url,
                                        quantity: req.body.quantity,
                                        productCategory: req.body.productCategory,
                                        // createdAt: moment().format('dddd'),
                                        // updatedAt: Date.now(),
                                        color: req.body.color,
                                        SubCategory: req.body.SubCategory
                                    });
                                    manufacturing.save(function (err) {
                                        if (err) {
                                            res.status(500).json({
                                                success: false,
                                                message: 'An error occurred',
                                                error: err
                                            });
                                        } else {
                                            res.status(200).json({success: true, message: 'Product has been created'});
                                        }
                                    });
                                    // });
                                }
                            }

                        }
                    }
                }
            }
        }
    });

    //Add Beauty Products

    router.post('/serviceProvider/products/beauty', tokenChecker, function (req, res) {
       if (!req.body.name) {
           res.status(400).json({success: false, message:'Product Name is required'});
       } else {
           if (!req.body.price) {
               res.status(400).json({success: false, message:'Price of the product is required'});
           } else {
               if (!req.body.description) {
                   res.status(400).json({success: false, message:'Description of the product is required'});
               } else {
                   if (!req.body.quantity){
                       res.status(400).json({success: false, message:'Quantity of available product is required'});
                   } else {
                       if (!req.body.productCategory) {
                           res.status(400).json({success: false, message:'Product Category is required'});
                       } else {
                           if (!req.body.color) {
                               res.status(400).json({success: false, message: 'Color is required'});
                           } else {
                               if (!req.body.brand) {
                                   res.status(400).json({success: false, message: 'Brand is required'});
                               } else {
                                   if (!req.body.gender) {
                                       res.status(400).json({success: false, message: 'Gender is required'});
                                   } else {
                                       if (!req.body.SubCategory) {
                                           res.status(400).json({success: false, message: 'Sub Category is required'});
                                       } else {

                                           /*
                                                                      var imagePath = '';

                                                                      upload(req, res, function (err) {
                                                                          if (err) {
                                                                              // An error occurred when uploading
                                                                              console.log(err);
                                                                              return res.status(422).send("an Error occured");
                                                                          }*/
                                           // imagePath = req.file.filename;


                                           let beauty = new Beauty({
                                               name: req.body.name,
                                               serviceProdiver: req.body.serviceProdiver,
                                               price: req.body.price,
                                               description: req.body.description,
                                               productCode: randomstring.generate(10),
                                               imageUrl: req.body.url,
                                               quantity: req.body.quantity,
                                               productCategory: req.body.productCategory,
                                               // createdAt: Date.now(),
                                               // updatedAt: Date.now(),
                                               color: req.body.color,
                                               brand: req.body.brand,
                                               gender: req.body.gender,
                                               SubCategory: req.body.SubCategory,

                                           });
                                           beauty.save(function (err) {
                                               if (err) {
                                                   res.status(500).json({
                                                       success: false,
                                                       message: 'An error occurred',
                                                       error: err
                                                   });
                                               } else {
                                                   res.status(200).json({
                                                       success: true,
                                                       message: 'Product has been created'
                                                   });
                                               }
                                           });
                                           // });
                                       }
                                   }
                               }
                           }
                       }

                   }
               }
           }
       }
    });


    //Add Computer Products

    router.post('/serviceProvider/products/computer', tokenChecker, function (req, res) {
        if (!req.body.name) {
            res.status(400).json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message:'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message:'Description of the product is required'});
                } else {
                    if (!req.body.quantity){
                        res.status(400).json({success: false, message:'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message:'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {
                                if (!req.body.OS) {
                                    res.status(400).json({success: false, message: 'OS is required'});
                                } else {
                                    if (!req.body.Screen) {
                                        res.status(400).json({success: false, message: 'Screen is required'});
                                    } else {
                                        if (!req.body.Ram) {
                                            res.status(400).json({success: false, message: 'Ram is required'});
                                        } else {
                                            if (!req.body.Processor) {
                                                res.status(400).json({
                                                    success: false,
                                                    message: 'Processor is required'
                                                });
                                            } else {
                                                if (!req.body.Brand) {
                                                    res.status(400).json({
                                                        success: false,
                                                        message: 'Brand is required'
                                                    });
                                                } else {
                                                    if (!req.body.MemorySpace) {
                                                        res.status(400).json({
                                                            success: false,
                                                            message: 'Memory space is required'
                                                        });
                                                    } else {

                                                        /*
                                                                                   var imagePath = '';

                                                                                   upload(req, res, function (err) {
                                                                                       if (err) {
                                                                                           // An error occurred when uploading
                                                                                           console.log(err);
                                                                                           return res.status(422).send("an Error occured");
                                                                                       }*/
                                                        // imagePath = req.file.filename;


                                                        let computer = new Computer({
                                                            name: req.body.name,
                                                            serviceProdiver: req.body.serviceProdiver,
                                                            price: req.body.price,
                                                            description: req.body.description,
                                                            productCode: randomstring.generate(10),
                                                            imageUrl: req.body.url,
                                                            quantity: req.body.quantity,
                                                            productCategory: req.body.productCategory,
                                                            // createdAt: Date.now(),
                                                            // updatedAt: Date.now(),
                                                            color: req.body.color,
                                                            OS: req.body.OS,
                                                            Screen: req.body.Screen,
                                                            Ram: req.body.Ram,
                                                            Processor: req.body.Processor,
                                                            gender: req.body.gender,
                                                            MemorySpace: req.body.MemorySpace

                                                        });
                                                        computer.save(function (err) {
                                                            if (err) {
                                                                res.status(500).json({
                                                                    success: false,
                                                                    message: 'An error occurred',
                                                                    error: err
                                                                });
                                                            } else {
                                                                res.status(200).json({
                                                                    success: true,
                                                                    message: 'Product has been created'
                                                                });
                                                            }
                                                        });
                                                        // });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    });

    //Add Electronics Products

    router.post('/serviceProvider/products/electronics', tokenChecker, function (req, res) {
        if (!req.body.name) {
            res.status(400).json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message:'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message:'Description of the product is required'});
                } else {
                    if (!req.body.quantity){
                        res.status(400).json({success: false, message:'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message:'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {
                                if (!req.body.Brand) {
                                    res.status(400).json({success: false, message: 'Brand is required'});
                                } else {
                                    if (!req.body.Size) {
                                        res.status(400).json({success: false, message: 'Size is required'});
                                    } else {

                                                        /*
                                                                                   var imagePath = '';

                                                                                   upload(req, res, function (err) {
                                                                                       if (err) {
                                                                                           // An error occurred when uploading
                                                                                           console.log(err);
                                                                                           return res.status(422).send("an Error occured");
                                                                                       }*/
                                                        // imagePath = req.file.filename;


                                                        let electronics = new Electronics({
                                                            name: req.body.name,
                                                            serviceProdiver: req.body.serviceProdiver,
                                                            price: req.body.price,
                                                            description: req.body.description,
                                                            productCode: randomstring.generate(10),
                                                            imageUrl: req.body.url,
                                                            quantity: req.body.quantity,
                                                            productCategory: req.body.productCategory,
                                                            // createdAt: Date.now(),
                                                            // updatedAt: Date.now(),
                                                            color: req.body.color,
                                                            OS: req.body.OS,
                                                            Screen: req.body.Screen,
                                                            Ram: req.body.Ram,
                                                            Processor: req.body.Processor,
                                                            gender: req.body.gender,
                                                            MemorySpace: req.body.MemorySpace,

                                                        });
                                                        electronics.save(function (err) {
                                                            if (err) {
                                                                res.status(500).json({
                                                                    success: false,
                                                                    message: 'An error occurred',
                                                                    error: err
                                                                });
                                                            } else {
                                                                res.status(200).json({
                                                                    success: true,
                                                                    message: 'Product has been created'
                                                                });
                                                            }
                                                        });// });
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    });


    // Add Fashion Products

    router.post('/serviceProvider/products/fashion', tokenChecker, function (req, res) {
        if (!req.body.name) {
            res.status(400).json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message:'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message:'Description of the product is required'});
                } else {
                    if (!req.body.quantity){
                        res.status(400).json({success: false, message:'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message:'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {
                                if (!req.body.Brand) {
                                    res.status(400).json({success: false, message: 'Brand is required'});
                                }else {
                                    if (!req.body.Size) {
                                        res.status(400).json({success: false, message: 'Size is required'});
                                    } else {
                                        if (!req.body.Gender) {
                                            res.status(400).json({success: false, message: 'Gender is required'});
                                        } else {
                                            if (!req.body.SubCategory) {
                                                res.status(400).json({
                                                    success: false,
                                                    message: 'Sub Category is required'
                                                });
                                            } else {

                                                /*
                                                                           var imagePath = '';

                                                                           upload(req, res, function (err) {
                                                                               if (err) {
                                                                                   // An error occurred when uploading
                                                                                   console.log(err);
                                                                                   return res.status(422).send("an Error occured");
                                                                               }*/
                                                // imagePath = req.file.filename;


                                                let fashion = new Fashion({
                                                    name: req.body.name,
                                                    serviceProdiver: req.body.serviceProdiver,
                                                    price: req.body.price,
                                                    description: req.body.description,
                                                    productCode: randomstring.generate(10),
                                                    imageUrl: req.body.url,
                                                    quantity: req.body.quantity,
                                                    productCategory: req.body.productCategory,
                                                    // createdAt: Date.now(),
                                                    // updatedAt: Date.now(),
                                                    color: req.body.color,
                                                    Brand: req.body.Brand,
                                                    Gender: req.body.Gender,
                                                    SubCategory: req.body.SubCategory

                                                });
                                                fashion.save(function (err) {
                                                    if (err) {
                                                        res.status(500).json({
                                                            success: false,
                                                            message: 'An error occurred',
                                                            error: err
                                                        });
                                                    } else {
                                                        res.status(200).json({
                                                            success: true,
                                                            message: 'Product has been created'
                                                        });
                                                    }
                                                });
                                                // });
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    });

    // Add Phone Products

    router.post('/serviceProvider/products/phone', tokenChecker, function (req, res) {
        if (!req.body.name) {
            res.status(400).json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message:'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message:'Description of the product is required'});
                } else {
                    if (!req.body.quantity){
                        res.status(400).json({success: false, message:'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message:'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {
                                if (!req.body.Brand) {
                                    res.status(400).json({success: false, message: 'Brand is required'});
                                }else {
                                    if (!req.body.Size) {
                                        res.status(400).json({success: false, message: 'Size is required'});
                                    } else {
                                        if (!req.body.ScreenSize) {
                                            res.status(400).json({success: false, message: 'Screen size is required'});
                                        } else {
                                            if (!req.body.CameraQuality) {
                                                res.status(400).json({
                                                    success: false,
                                                    message: 'Camera Quality is required'
                                                });
                                            } else {
                                                if (!req.body.Ram) {
                                                    res.status(400).json({
                                                        success: false,
                                                        message: 'Ram is required'
                                                    });
                                                } else {
                                                    if (!req.body.BatteryPower) {
                                                        res.status(400).json({
                                                            success: false,
                                                            message: 'Battery Power is required'
                                                        });
                                                    } else {
                                                        if (!req.body.InternalMemory) {
                                                            res.status(400).json({
                                                                success: false,
                                                                message: 'Internal Memory is required'
                                                            });
                                                        } else {
                                                            if (!req.body.SimSlotNumber) {
                                                                res.status(400).json({
                                                                    success: false,
                                                                    message: 'Sim slot number is required'
                                                                });
                                                            } else {

                                                                /*
                                                                                           var imagePath = '';

                                                                                           upload(req, res, function (err) {
                                                                                               if (err) {
                                                                                                   // An error occurred when uploading
                                                                                                   console.log(err);
                                                                                                   return res.status(422).send("an Error occured");
                                                                                               }*/
                                                                // imagePath = req.file.filename;


                                                                let phone = new Phone({
                                                                    name: req.body.name,
                                                                    serviceProdiver: req.body.serviceProdiver,
                                                                    price: req.body.price,
                                                                    description: req.body.description,
                                                                    productCode: randomstring.generate(10),
                                                                    imageUrl: req.body.url,
                                                                    quantity: req.body.quantity,
                                                                    productCategory: req.body.productCategory,
                                                                    // createdAt: Date.now(),
                                                                    // updatedAt: Date.now(),
                                                                    color: req.body.color,
                                                                    Size: req.body.size,
                                                                    Brand: req.body.Brand,
                                                                    ScreenSize: req.body.ScreenSize,
                                                                    CameraQuality: req.body.CameraQuality,
                                                                    Ram: req.body.Ram,
                                                                    BatteryPower: req.body.BatteryPower,
                                                                    InternalMemory: req.body.InternalMemory,
                                                                    SimSlotNumber: req.body.SimSlotNumber

                                                                });
                                                                phone.save(function (err) {
                                                                    if (err) {
                                                                        res.status(500).json({
                                                                            success: false,
                                                                            message: 'An error occurred',
                                                                            error: err
                                                                        });
                                                                    } else {
                                                                        res.status(200).json({
                                                                            success: true,
                                                                            message: 'Product has been created'
                                                                        });
                                                                    }
                                                                });
                                                                // });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    });

    //Add Raw Material Products

    router.post('/serviceProvider/products/rawmaterial', tokenChecker, function (req, res) {
        if (!req.body.name) {
            res.status(400).json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message:'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message:'Description of the product is required'});
                } else {
                    if (!req.body.quantity){
                        res.status(400).json({success: false, message:'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message:'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {

                                            /*
                                                                       var imagePath = '';

                                                                       upload(req, res, function (err) {
                                                                           if (err) {
                                                                               // An error occurred when uploading
                                                                               console.log(err);
                                                                               return res.status(422).send("an Error occured");
                                                                           }*/
                                            // imagePath = req.file.filename;


                                            let rawmaterial = new Rawmaterial({
                                                name: req.body.name,
                                                serviceProdiver: req.body.serviceProdiver,
                                                price: req.body.price,
                                                description: req.body.description,
                                                productCode: randomstring.generate(10),
                                                imageUrl: req.body.url,
                                                quantity: req.body.quantity,
                                                productCategory: req.body.productCategory,
                                                // createdAt: Date.now(),
                                                // updatedAt: Date.now(),
                                                color: req.body.color

                                            });
                                            rawmaterial.save(function (err) {
                                                if (err) {
                                                    res.status(500).json({
                                                        success: false,
                                                        message: 'An error occurred',
                                                        error: err
                                                    });
                                                } else {
                                                    res.status(200).json({
                                                        success: true,
                                                        message: 'Product has been created'
                                                    });
                                                }
                                            });
                            }
                        }
                    }
                }
            }

        }

    });


    //Update Beauty Product

    router.put('/serviceProvider/products/beauty/:id', tokenChecker, function (req, res) {

        if (!req.body.name) {
            res.status(400).json({success: false, message: 'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message: 'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message: 'Description of the product is required'});
                } else {
                    if (!req.body.quantity) {
                        res.status(400).json({success: false, message: 'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message: 'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {
                                if (!req.body.brand) {
                                    res.status(400).json({success: false, message: 'Brand is required'});
                                } else {
                                    if (!req.body.gender) {
                                        res.status(400).json({success: false, message: 'Gender is required'});
                                    } else {
                                        if (!req.body.SubCategory) {
                                            res.status(400).json({success: false, message: 'Sub Category is required'});
                                        } else {

                                            /*
                                                                       var imagePath = '';

                                                                       upload(req, res, function (err) {
                                                                           if (err) {
                                                                               // An error occurred when uploading
                                                                               console.log(err);
                                                                               return res.status(422).send("an Error occured");
                                                                           }*/
                                            // imagePath = req.file.filename;

                                            Beauty.findByIdAndUpdate(req.params.id, {
                                                name: req.body.name,
                                                serviceProdiver: req.body.serviceProdiver,
                                                price: req.body.price,
                                                description: req.body.description,
                                                productCode: randomstring.generate(10),
                                                imageUrl: req.body.url,
                                                quantity: req.body.quantity,
                                                productCategory: req.body.productCategory,
                                                // createdAt: Date.now(),
                                                updatedAt: moment().format("L"),
                                                color: req.body.color,
                                                brand: req.body.brand,
                                                gender: req.body.gender,
                                                SubCategory: req.body.SubCategory

                                            }, function (err) {
                                                if (err) {
                                                    res.status(500).json({success: false, message: 'Product could not be updated'});
                                                } else {
                                                    res.status(200).json({success: true, message: 'Product has been updated'});
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    });


    //Update Computer Product

    router.put('/serviceProvider/products/computer/:id', tokenChecker, function (req, res) {

        if (!req.body.name) {
            res.status(400).json({success: false, message: 'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message: 'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message: 'Description of the product is required'});
                } else {
                    if (!req.body.quantity) {
                        res.status(400).json({success: false, message: 'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message: 'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {
                                if (!req.body.OS) {
                                    res.status(400).json({success: false, message: 'OS is required'});
                                } else {
                                    if (!req.body.Screen) {
                                        res.status(400).json({success: false, message: 'Screen is required'});
                                    } else {
                                        if (!req.body.Ram) {
                                            res.status(400).json({success: false, message: 'Ram is required'});
                                        } else {
                                            if (!req.body.Processor) {
                                                res.status(400).json({
                                                    success: false,
                                                    message: 'Processor is required'
                                                });
                                            } else {
                                                if (!req.body.Brand) {
                                                    res.status(400).json({
                                                        success: false,
                                                        message: 'Brand is required'
                                                    });
                                                } else {
                                                    if (!req.body.MemorySpace) {
                                                        res.status(400).json({
                                                            success: false,
                                                            message: 'Memory space is required'
                                                        });
                                                    } else {

                                                        /*
                                                                                   var imagePath = '';

                                                                                   upload(req, res, function (err) {
                                                                                       if (err) {
                                                                                           // An error occurred when uploading
                                                                                           console.log(err);
                                                                                           return res.status(422).send("an Error occured");
                                                                                       }*/
                                                        // imagePath = req.file.filename;


                                                        Computer.findByIdAndUpdate(req.params.id, {
                                                            name: req.body.name,
                                                            serviceProdiver: req.body.serviceProdiver,
                                                            price: req.body.price,
                                                            description: req.body.description,
                                                            productCode: randomstring.generate(10),
                                                            imageUrl: req.body.url,
                                                            quantity: req.body.quantity,
                                                            productCategory: req.body.productCategory,
                                                            // createdAt: Date.now(),
                                                            updatedAt: moment().format("L"),
                                                            color: req.body.color,
                                                            OS: req.body.OS,
                                                            Screen: req.body.Screen,
                                                            Ram: req.body.Ram,
                                                            Processor: req.body.Processor,
                                                            gender: req.body.gender,
                                                            MemorySpace: req.body.MemorySpace

                                                        }, function (err) {
                                                            if (err) {
                                                                res.status(500).json({success: false, message: 'Product could not be updated'});
                                                            } else {
                                                                res.status(200).json({success: true, message: 'Product has been updated'});
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    });



    // Update Electronics Product

    router.put('/serviceProvider/products/electronics/:id', tokenChecker, function (req, res) {

        if (!req.body.name) {
            res.status(400).json({success: false, message: 'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message: 'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message: 'Description of the product is required'});
                } else {
                    if (!req.body.quantity) {
                        res.status(400).json({success: false, message: 'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message: 'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {
                                if (!req.body.OS) {
                                    res.status(400).json({success: false, message: 'OS is required'});
                                } else {
                                    if (!req.body.Screen) {
                                        res.status(400).json({success: false, message: 'Screen is required'});
                                    } else {
                                        if (!req.body.Ram) {
                                            res.status(400).json({success: false, message: 'Ram is required'});
                                        } else {
                                            if (!req.body.Processor) {
                                                res.status(400).json({
                                                    success: false,
                                                    message: 'Processor is required'
                                                });
                                            } else {
                                                if (!req.body.Brand) {
                                                    res.status(400).json({
                                                        success: false,
                                                        message: 'Brand is required'
                                                    });
                                                } else {
                                                    if (!req.body.MemorySpace) {
                                                        res.status(400).json({
                                                            success: false,
                                                            message: 'Memory space is required'
                                                        });
                                                    } else {

                                                        /*
                                                                                   var imagePath = '';

                                                                                   upload(req, res, function (err) {
                                                                                       if (err) {
                                                                                           // An error occurred when uploading
                                                                                           console.log(err);
                                                                                           return res.status(422).send("an Error occured");
                                                                                       }*/
                                                        // imagePath = req.file.filename;


                                                        Electronics.findByIdAndUpdate(req.params.id, {
                                                            name: req.body.name,
                                                            serviceProdiver: req.body.serviceProdiver,
                                                            price: req.body.price,
                                                            description: req.body.description,
                                                            productCode: randomstring.generate(10),
                                                            imageUrl: req.body.url,
                                                            quantity: req.body.quantity,
                                                            productCategory: req.body.productCategory,
                                                            // createdAt: Date.now(),
                                                            updatedAt: moment().format("L"),
                                                            color: req.body.color,
                                                            OS: req.body.OS,
                                                            Screen: req.body.Screen,
                                                            Ram: req.body.Ram,
                                                            Processor: req.body.Processor,
                                                            gender: req.body.gender,
                                                            MemorySpace: req.body.MemorySpace

                                                        }, function (err) {
                                                            if (err) {
                                                                res.status(500).json({
                                                                    success: false,
                                                                    message: 'Product could not be updated'
                                                                });
                                                            } else {
                                                                res.status(200).json({
                                                                    success: true,
                                                                    message: 'Product has been updated'
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    });

    // Update Fashion Product

    router.put('/serviceProvider/products/fashion/:id', tokenChecker, function (req, res) {
        if (!req.body.name) {
            res.status(400).json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message: 'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message: 'Description of the product is required'});
                } else {
                    if (!req.body.quantity) {
                        res.status(400).json({success: false, message: 'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message: 'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {
                                if (!req.body.Brand) {
                                    res.status(400).json({success: false, message: 'Brand is required'});
                                } else {
                                    if (!req.body.Size) {
                                        res.status(400).json({success: false, message: 'Size is required'});
                                    } else {
                                        if (!req.body.Gender) {
                                            res.status(400).json({success: false, message: 'Gender is required'});
                                        } else {
                                            if (!req.body.SubCategory) {
                                                res.status(400).json({
                                                    success: false,
                                                    message: 'Sub Category is required'
                                                });
                                            } else {


                                                /*
                                                                           var imagePath = '';

                                                                           upload(req, res, function (err) {
                                                                               if (err) {
                                                                                   // An error occurred when uploading
                                                                                   console.log(err);
                                                                                   return res.status(422).send("an Error occured");
                                                                               }*/
                                                // imagePath = req.file.filename;


                                                Fashion.findByIdAndUpdate(req.params.id, {
                                                    name: req.body.name,
                                                    serviceProdiver: req.body.serviceProdiver,
                                                    price: req.body.price,
                                                    description: req.body.description,
                                                    productCode: randomstring.generate(10),
                                                    imageUrl: req.body.url,
                                                    quantity: req.body.quantity,
                                                    productCategory: req.body.productCategory,
                                                    // createdAt: Date.now(),
                                                    updatedAt: moment().format("L"),
                                                    color: req.body.color,
                                                    Brand: req.body.Brand,
                                                    Gender: req.body.Gender,
                                                    SubCategory: req.body.SubCategory

                                                }, function (err) {
                                                    if (err) {
                                                        res.status(500).json({
                                                            success: false,
                                                            message: 'Product could not be updated'
                                                        });
                                                    } else {
                                                        res.status(200).json({
                                                            success: true,
                                                            message: 'Product has been updated'
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Update Phone Product

    router.put('/serviceProvider/products/phone/:id', tokenChecker, function (req, res) {
        if (!req.body.name) {
            res.status(400).json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message: 'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message: 'Description of the product is required'});
                } else {
                    if (!req.body.quantity) {
                        res.status(400).json({success: false, message: 'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message: 'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {
                                if (!req.body.Brand) {
                                    res.status(400).json({success: false, message: 'Brand is required'});
                                } else {
                                    if (!req.body.Size) {
                                        res.status(400).json({success: false, message: 'Size is required'});
                                    } else {
                                        if (!req.body.ScreenSize) {
                                            res.status(400).json({success: false, message: 'Screen size is required'});
                                        } else {
                                            if (!req.body.CameraQuality) {
                                                res.status(400).json({
                                                    success: false,
                                                    message: 'Camera Quality is required'
                                                });
                                            } else {
                                                if (!req.body.Ram) {
                                                    res.status(400).json({
                                                        success: false,
                                                        message: 'Ram is required'
                                                    });
                                                } else {
                                                    if (!req.body.BatteryPower) {
                                                        res.status(400).json({
                                                            success: false,
                                                            message: 'Battery Power is required'
                                                        });
                                                    } else {
                                                        if (!req.body.InternalMemory) {
                                                            res.status(400).json({
                                                                success: false,
                                                                message: 'Internal Memory is required'
                                                            });
                                                        } else {
                                                            if (!req.body.SimSlotNumber) {
                                                                res.status(400).json({
                                                                    success: false,
                                                                    message: 'Sim slot number is required'
                                                                });
                                                            } else {


                                                                /*
                                                                                           var imagePath = '';

                                                                                           upload(req, res, function (err) {
                                                                                               if (err) {
                                                                                                   // An error occurred when uploading
                                                                                                   console.log(err);
                                                                                                   return res.status(422).send("an Error occured");
                                                                                               }*/
                                                                // imagePath = req.file.filename;


                                                                Phone.findByIdAndUpdate(req.params.id, {
                                                                    name: req.body.name,
                                                                    serviceProdiver: req.body.serviceProdiver,
                                                                    price: req.body.price,
                                                                    description: req.body.description,
                                                                    productCode: randomstring.generate(10),
                                                                    imageUrl: req.body.url,
                                                                    quantity: req.body.quantity,
                                                                    productCategory: req.body.productCategory,
                                                                    // createdAt: Date.now(),
                                                                    updatedAt: moment().format("L"),
                                                                    color: req.body.color,
                                                                    Size: req.body.size,
                                                                    Brand: req.body.Brand,
                                                                    ScreenSize: req.body.ScreenSize,
                                                                    CameraQuality: req.body.CameraQuality,
                                                                    Ram: req.body.Ram,
                                                                    BatteryPower: req.body.BatteryPower,
                                                                    InternalMemory: req.body.InternalMemory,
                                                                    SimSlotNumber: req.body.SimSlotNumber

                                                                }, function (err) {
                                                                    if (err) {
                                                                        res.status(500).json({
                                                                            success: false,
                                                                            message: 'Product could not be updated'
                                                                        });
                                                                    } else {
                                                                        res.status(200).json({
                                                                            success: true,
                                                                            message: 'Product has been updated'
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Update Raw Material Product

    router.put('/serviceProvider/products/rawmaterial/:id', tokenChecker, function (req, res) {
        if (!req.body.name) {
            res.status(400).json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message: 'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message: 'Description of the product is required'});
                } else {
                    if (!req.body.quantity) {
                        res.status(400).json({success: false, message: 'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message: 'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {


                                /*
                                                           var imagePath = '';

                                                           upload(req, res, function (err) {
                                                               if (err) {
                                                                   // An error occurred when uploading
                                                                   console.log(err);
                                                                   return res.status(422).send("an Error occured");
                                                               }*/
                                // imagePath = req.file.filename;


                                Rawmaterial.findByIdAndUpdate(req.params.id, {
                                    name: req.body.name,
                                    serviceProdiver: req.body.serviceProdiver,
                                    price: req.body.price,
                                    description: req.body.description,
                                    productCode: randomstring.generate(10),
                                    imageUrl: req.body.url,
                                    quantity: req.body.quantity,
                                    productCategory: req.body.productCategory,
                                    // createdAt: Date.now(),
                                    updatedAt: moment().format("L"),
                                    color: req.body.color

                                }, function (err) {
                                    if (err) {
                                        res.status(500).json({
                                            success: false,
                                            message: 'Product could not be updated'
                                        });
                                    } else {
                                        res.status(200).json({
                                            success: true,
                                            message: 'Product has been updated'
                                        });
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    });


    // Update Manufacturing Product

    router.put('/serviceProvider/products/manufacturing/:id', tokenChecker, function (req, res) {
        if (!req.body.name) {
            res.status(400).json({success: false, message:'Product Name is required'});
        } else {
            if (!req.body.price) {
                res.status(400).json({success: false, message:'Price of the product is required'});
            } else {
                if (!req.body.description) {
                    res.status(400).json({success: false, message:'Description of the product is required'});
                } else {
                    if (!req.body.quantity){
                        res.status(400).json({success: false, message:'Quantity of available product is required'});
                    } else {
                        if (!req.body.productCategory) {
                            res.status(400).json({success: false, message:'Product Category is required'});
                        } else {
                            if (!req.body.color) {
                                res.status(400).json({success: false, message: 'Color is required'});
                            } else {
                                if (!req.body.SubCategory) {
                                    res.status(400).json({success: false, message: 'Sub Category is required'});
                                } else {


                                    /*
                                                               var imagePath = '';

                                                               upload(req, res, function (err) {
                                                                   if (err) {
                                                                       // An error occurred when uploading
                                                                       console.log(err);
                                                                       return res.status(422).send("an Error occured");
                                                                   }*/
                                    // imagePath = req.file.filename;


                                    Manufacturing.findByIdAndUpdate(req.params.id, {
                                        name: req.body.name,
                                        serviceProdiver: req.body.serviceProdiver,
                                        price: req.body.price,
                                        description: req.body.description,
                                        productCode: randomstring.generate(10),
                                        imageUrl: req.body.url,
                                        quantity: req.body.quantity,
                                        productCategory: req.body.productCategory,
                                        // createdAt: Date.now(),
                                        updatedAt: moment().format("L"),
                                        color: req.body.color,
                                        SubCategory: req.body.SubCategory

                                    }, function (err) {
                                        if (err) {
                                            res.status(500).json({
                                                success: false,
                                                message: 'Product could not be updated'
                                            });
                                        } else {
                                            res.status(200).json({
                                                success: true,
                                                message: 'Product has been updated'
                                            });
                                        }
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    });




    //Delete beauty product

    router.delete('/serviceProvider/products/beauty/:id', tokenChecker, function (req,res) {
       Beauty.findByIdAndRemove({_id: req.params.id}).then(function (done) {
         if(done){
             res.status(200).json({success: true, message: 'Product was successfully deleted'});
         }  else {
             res.status(500).json({success: false, message:'An error occurred. Try again later.'});
         }
       });
    });

    //Delete manufacturing product

    router.delete('/serviceProvider/products/manufacturing/:id', tokenChecker, function (req,res) {
        Manufacturing.findByIdAndRemove({_id: req.params.id}).then(function (done) {
            if(done){
                res.status(200).json({success: true, message: 'Product was successfully deleted'});
            }  else {
                res.status(500).json({success: false, message:'An error occurred. Try again later.'});
            }
        });
    });

    //Delete fashion product

    router.delete('/serviceProvider/products/fashion/:id', tokenChecker, function (req,res) {
        Fashion.findByIdAndRemove({_id: req.params.id}).then(function (done) {
            if(done){
                res.status(200).json({success: true, message: 'Product was successfully deleted'});
            }  else {
                res.status(500).json({success: false, message:'An error occurred. Try again later.'});
            }
        });
    });

    //Delete electronics product

    router.delete('/serviceProvider/products/electronics/:id', tokenChecker, function (req,res) {
        Electronics.findByIdAndRemove({_id: req.params.id}).then(function (done) {
            if(done){
                res.status(200).json({success: true, message: 'Product was successfully deleted'});
            }  else {
                res.status(500).json({success: false, message:'An error occurred. Try again later.'});
            }
        });
    });

    //Delete beauty product

    router.delete('/serviceProvider/products/computer/:id', tokenChecker, function (req,res) {
        Computer.findByIdAndRemove({_id: req.params.id}).then(function (done) {
            if(done){
                res.status(200).json({success: true, message: 'Product was successfully deleted'});
            }  else {
                res.status(500).json({success: false, message:'An error occurred. Try again later.'});
            }
        });
    });

    //Delete phone product

    router.delete('/serviceProvider/products/phone/:id', tokenChecker, function (req,res) {
        Phone.findByIdAndRemove({_id: req.params.id}).then(function (done) {
            if(done){
                res.status(200).json({success: true, message: 'Product was successfully deleted'});
            }  else {
                res.status(500).json({success: false, message:'An error occurred. Try again later.'});
            }
        });
    });

    //Delete Raw material product

    router.delete('/serviceProvider/products/rawmaterial/:id', tokenChecker, function (req,res) {
        Rawmaterial.findByIdAndRemove({_id: req.params.id}).then(function (done) {
            if(done){
                res.status(200).json({success: true, message: 'Product was successfully deleted'});
            }  else {
                res.status(500).json({success: false, message:'An error occurred. Try again later.'});
            }
        });
    });

    return router;
};
