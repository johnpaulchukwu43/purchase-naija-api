/*
 Created by Johnpaul Chukwu @ $
*/

var UserCart = require('../models/userCart');
var constants = require('../common/constants');
var Fashion = require('../models/product_categories/FashionProduct');
var rawMaterials = require('../models/product_categories/RawmaterialProduct');
var Computer = require('../models/product_categories/ComputerProduct');
var Phones = require('../models/product_categories/PhonesProduct');
var Beauty = require('../models/product_categories/BeautyProduct');
var Electronics = require('../models/product_categories/ElectronicsProduct');
var Manufacturing = require('../models/product_categories/ManufacturingProduct');
var Provider = require('../models/serviceProvider');
var Admin = require('../models/admin');

var getCategoryCollectionModel = require('./baseRequest').getCategoryCollectionModel;


function validateRequest(req, res) {
    if (!req.body.userId) {
        res.status(400).json({success: false, message: 'userId is required'});
    } else {
        if (!req.body.productId) {
            res.status(400).json({success: false, message: 'ProductID is required'});
        } else {
            if (!req.body.category) {
                res.status(400).json({success: false, message: 'category is required'});
            } else {
                if (!req.body.cartType) {
                    res.status(400).json({success: false, message: 'Cart is required'});
                } else {
                    if (!req.body.quantity) {
                        res.status(400).json({success: false, message: 'Quantity is required'});
                    } else {
                        if (!req.body.provider) {
                            res.status(400).json({success: false, message: 'Provider is required'});
                        }else{
                            return true;
                        }

                    }
                }
            }
        }
    }
}

function validateUpdateCartTypeRequest(req, res) {
    const cartType = req.body.cartType;
    const newUserId = req.body.customerId;
    if (!cartType) {
        res.status(400).json({success: false, message: 'CartType is required'});
    }
    else if (isValidCartType(cartType)) {
        if (!newUserId) {
            res.status(400).json({success: false, message: 'UserId is required'});
        } else {
            return true;
        }
    }
    else {
        res.status(400).json({success: false, message: cartType + ' is not a recognised Cart type'});
    }

}

function validateCrementType(type) {
    switch (type) {
        case constants.INCREMENT:
            return constants.INCREMENT;
        case constants.DECREMENT:
            return constants.DECREMENT;
        default:
            return null;
    }
}

function validateUpdateCartRequest(req, res) {
    if (!req.body.quantity) {
        res.status(400).json({success: false, message: 'Quantity of product to be updated is required'});
    } else if (validateCrementType(req.body.crementType) === null) {
        res.status(400).json({success: false, message: 'CREMENT type must be either (INCREMENT / DECREMENT)'});
    } else {
        return true;
    }
}

function createCart(req, res) {
    const productId = req.body.productId;
    const category = req.body.category;
    const providerName =req.body.provider;

    //todo validate that same productId and categoryId pair cannot be added twice
    //verify that provider supplied is correct and does exist
    findProvider(providerName).then(result=>{
        if(result.success === true){
            var userCart = new UserCart({
                userId: req.body.userId,
                productId: productId,
                category: category,
                cartType: req.body.cartType,
                quantity: req.body.quantity,
                provider:providerName,
                status: constants.PENDING
            });
            userCart.save(function (err) {
                if (err) {
                    res.status(500).json({success: false, message: err});
                } else {
                    updateProductInCollection(req, res, productId, category, 1, constants.INCREMENT).then(function (result) {
                        res.status(200).json({success: true, message: 'Added to cart !!'});
                    }).catch(function (err) {
                        const code = err.code;
                        const message = err.message;
                        res.status(code).json({success: false, message});
                    })
                }
            });
        }else{
            //still an anomaly, front end should prevent this
            res.status(400).json({success: false, message: 'Add to Cart Failed, Could not verify Provider of product'});
        }
    }).catch(err=>{
        res.status(400).json({success: false, message: 'Add to Cart Failed, Could not verify Provider of product'});
        console.log('ADD TO CART FAILED'+JSON.stringify(err));
    });


}

function isValidCartType(cartType) {
    const cartTypes = constants.cartTypes;
    var isValid = false;
    cartTypes.forEach(function (element) {
        if (element === cartType) {
            isValid = true;
        }
    });
    return isValid;
}

function updateCart(req, res) {
    //find the user ,update the productQuantity in cart ,update the product in its collection
    var userId = req.params.userId;
    var category = req.params.category;
    var productId = req.params.productId;
    //todo validate all params exists !!
    getCartIdForUserBasedOnProductAndCategory(userId, category, productId)
        .then(function (userCart) {
            if (!userCart) {
                res.status(400).json({success: false, message: 'Product Not found in cart'})
            } else {
                updateProductInCart(req, res, userCart);
            }
        })
        .catch(function (err) {
            res.status(500).json({success: false, message: err})
        })
}

function getCartIdForUserBasedOnProductAndCategory(userId, category, productId) {
    return UserCart.findOne({userId: userId, category: category, productId: productId,status:constants.PENDING})
        .exec()
}

function updateCartType(req, res) {
    const cartType = req.body.cartType;
    const prevUserId = req.params.userId;
    const newUserId = req.body.customerId;

    UserCart.updateMany({userId: prevUserId}, {userId: newUserId, cartType: cartType}, function (err, result) {
        if (err) {
            res.status(500).json({success: false, message: err});
        } else if (!result) {
            res.status(404).json({success: false, message: 'Cart not found '});
        }
        else {
            res.status(200).json({success: true, message: 'Cart Type Updated '});
        }
    })
}

function updateProductInCart(req, res, userCart) {

    const cartID = userCart._id;
    //crement as in increment or decrement :p
    const crementType = req.body.crementType;
    const newQuantity = parseInt(req.body.quantity);
    const oldQuantity = userCart.quantity;
    let diffQuantity = null;
    if (crementType === constants.INCREMENT)
        diffQuantity = newQuantity - oldQuantity;
    else
        diffQuantity = oldQuantity - newQuantity;

    UserCart.findByIdAndUpdate(cartID, {
        quantity: newQuantity
    }, function (err, cart) {
        if (err) {
            res.status(400).json({success: false, message: 'Cart could not be updated:'+err});
        } else {

            updateProductInCollection(req, res, userCart.productId, userCart.category, diffQuantity, crementType)
                .then(function () {
                    res.status(200).json({success: true, message: 'Cart Updated'});
                }).catch(function (err) {
                    res.status(err.code).json({success: false, message:err.message});
            })
        }
    });
}

function removeProductFromCart(req, res) {
    //find the user ,update the productQuantity in cart ,update the product in its collection
    var userId = req.params.userId;
    var category = req.params.category;
    var productId = req.params.productId;
    getCartIdForUserBasedOnProductAndCategory(userId, category, productId)
        .then(function (userCart) {
            if (!userCart) {
                res.status(400).json({success: false, message: 'Product Not found in cart'})
            } else {
                const cartID = userCart._id;
                UserCart.findByIdAndRemove({_id: cartID}).exec()
                    .then(function (done) {
                        if (done) {
                            //After deleting from cart, we add the products back to our store
                            updateProductInCollection(req, res, productId, category, userCart.quantity, constants.DECREMENT).then(function (result) {
                                res.status(200).json({success: true, message: 'Cart was successfully deleted'});
                            }).catch(function (err) {
                                const code = err.code;
                                const message = err.message;
                                res.status(code).json({success: false, message: message});
                            })
                        } else {
                            res.status(400).json({success: false, message: 'An error occurred. Try again later.'});
                        }

                    })
                    .catch(function (err) {
                        res.status(500).json({success: false, message: err});
                    })
            }
        })
        .catch(function (err) {
            res.status(500).json({success: false, message: err})
        })
}

function updateProductInCollection(req, res, prodId, category, quantityUserWishesToBuy, crementType) {
    return new Promise(function (resolve, reject) {
        let categoryModel = getCategoryCollectionModel(category);
        if (categoryModel) {
            categoryModel.findOne({_id: prodId}, function (err, product) {
                if (err) {
                    reject({message: err, code: 500});
                }
                //an anomaly
                if (product === null) {
                    return reject({message: "Product doesn't exist, verify the correct and matching product ID, " +
                            "category and provider were entered.", code: 404});
                }
                const quantityLeftInDb = product.quantity;
                let newQuantity;
                //this means we are removing products from our store and adding to the user's cart (action happens when customer adds to cart)
                if (crementType === constants.INCREMENT) {

                    //another anomaly :(
                    if (quantityLeftInDb === 0) {
                        reject({message: "Product has finished", code: 400});

                    }else if (quantityUserWishesToBuy > quantityLeftInDb) {
                        //in real life scenario, app client should prevent this from getting here sef
                        reject({
                            message: "Insufficient Product Quantity," +
                                      "Quantity Left:" + quantityLeftInDb,
                            code: 400
                        })
                    }else{
                        newQuantity = quantityLeftInDb - quantityUserWishesToBuy;
                        categoryModel.findByIdAndUpdate(prodId, {quantity: newQuantity}, function (err, result) {
                            if (err) {
                                reject({message: err, code: 500})
                            }
                            resolve({code: 200, message: "success"});
                        })

                    }


                }
                else {
                    // (action happens when customer removes from cart)
                    newQuantity = quantityLeftInDb + quantityUserWishesToBuy;
                    categoryModel.findByIdAndUpdate(prodId, {quantity: newQuantity}, function (err, result) {
                        if (err) {
                            reject({message: err, code: 500})
                        }
                        resolve({code: 200, message: "success"});
                    })
                }
            })
        }
        else {
            reject({message: 'Category specified does not exist', code: 400});
        }
    });
}

function getProductDetails(productId, category) {
    return getCategoryCollectionModel(category)
        .findOne({_id: productId})
        .exec();
}

function prepareCartResult(cartResults) {
    var promises = [];
    var products = [];
    return new Promise(function (resolve, reject) {

        cartResults.forEach(function (item) {
            promises.push(getProductDetails(item.productId, item.category).then(function (product) {
                products.push({
                    productId: item.productId,
                    productInfo: product,
                    category: item.category,
                    quantity: item.quantity,
                    provider:item.provider,
                    status: item.status
                });
            }));
        });

        Promise.all(promises)
            .then(function () {
                resolve(products);
            })
            .catch(function (err) {
                reject(err);
            })
    })
}

function getCart(req, res) {
    return new Promise(function (resolve, reject) {
        var userId = req.params.userId;
        var cartType = req.params.cartType || null;
        var cartInfo = {};

        UserCart.find({userId: userId,status:constants.PENDING}).exec()
            .then(function (cartResults) {
                //if cart is not empty
                if (cartResults.length !== 0) {
                    //for each cart item we try to fetch the product details with the product id
                    prepareCartResult(cartResults).then(function (products) {
                        cartInfo = {
                            products: products,
                            cartType: cartResults[0].cartType,
                        };
                        resolve({userId: userId, cartInfo: cartInfo});
                    }).catch(function (err) {
                        reject({code:500,message:err});
                    })
                } else {
                    if (!cartType) {
                        reject({code:400,message:"Cart Type parameter is required"})
                    }
                    cartInfo = {
                        products: [],
                        cartType: cartType,
                    };
                    resolve({userId: userId, cartInfo: cartInfo});
                }
            })
            .catch(function (err) {
                reject({code:500,message:err});
            })
    })
}


function findProvider(providerName){
    return new Promise((resolve, reject) => {
        Provider.findOne({businessName:providerName}).exec().then(provider=>{
            if(provider)
                resolve({success:true,provider:provider});
            else{
                //if no provider was found, check if the product was provided by an admin
                findAdmin(providerName).then(admin=>{
                    if(admin)
                        resolve({success:true,provider:admin});
                    else{
                        reject({success:false,error:"Couldn't find owner of product"})
                    }
                }).catch(err=>{
                    reject({success:false,error:err})
                })
            }

        }).catch(err=>{
            reject({success:false,error:err})
        })
    })
}

function findAdmin(adminName){
    return  Admin.findOne({username:adminName}).exec();
}



module.exports = {
    validateRequest,
    createCart,
    getCart,
    updateCart,
    validateUpdateCartTypeRequest,
    validateUpdateCartRequest,
    removeProductFromCart,
    updateCartType
};
