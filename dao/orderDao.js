/*
 Created by Johnpaul Chukwu @ $
*/

const baseRequest = require('../dao/baseRequest');
const UserCart = require('../models/userCart');
const Order = require('../models/order');
var randomstring = require("randomstring");
var validQueryParameters = require('../common/validation').validQueryParameters;

function validateCreateOrderRequest(req, res) {
    if (!req.params.userId) {
        res.status(400).json({success: false, message: "User Id is required"});
    } else {
        if (!req.body.paymentType) {
            res.status(400).json({success: false, message: "Payment type is required"});
        } else {
            return true;
        }
    }
}

function getUsersCart(req, status) {
    return UserCart.find({userId: req.params.userId, status: status}).exec();
}

function updateCartStatus(req, res, oldStatus, newStatus) {
    return new Promise((resolve, reject) => {
        UserCart.update({
            userId: req.params.userId,
            status: oldStatus
        }, {status: newStatus}, {multi: true}, (err, result) => {
            if (err) {
                //reject
                reject({success: false, code: 500, err});
            } else {
                //find the updated cart
                resolve({success: true, code: 200})
            }
        })
    });
}

function updateSingleOrderDeliveryStatus(req, res) {
    const orderId = req.params.orderId;
    Order.findByIdAndUpdate(orderId, {isDelivered: true}).exec()
        .then(function (result) {
            console.log(JSON.stringify(result));
            res.status(200).json({success: true, message: "updated order"});
        }).catch(function (err) {
        res.status(500).json({success: false, message: err});
    })
}

function updateOrderDeliveryStatus(req, res) {
    const orderCode = req.params.orderCode;
    Order.updateMany({orderCode: orderCode}, {isDelivered: true}).exec()
        .then(function (result) {
            if (result.nModified > 0) {
                res.status(200).json({success: true, message: "updated order"});
            } else {
                res.status(404).json({
                    success: true,
                    message: "Order code does not match any record or has already been updated"
                });
            }

        }).catch(function (err) {
        res.status(500).json({success: false, message: err});
    })
}

function alreadyExistsInlist(list,element){
    var pos = -1;

    list.forEach((item,index)=>{
        if(item.orderCode === element){
            pos = index;
        }
    });
    return pos;
}

function addProductDetailsToOrderList(productDetailList, refinedOrderList, order, product, cart) {

    var refinedCartInfo = [{
        quantityOrdered: cart.quantity,
        productInfo: product
    }];
    var refinedOrders = {
        name: order.name,
        userId: order.userId,
        orderCode: order.orderCode,
        paymentID: order.paymentID,
        paymentType: order.paymentType,
        productDetail: refinedCartInfo,
        isDelivered: order.isDelivered,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
    refinedOrderList.push(refinedOrders);
}

function getProductDetailsForOrder(orders, res) {
    var promises =[];
    var cart;
    var refinedOrderList = [];
    var productDetailList = [];

    return new Promise((resolve, reject) => {
        orders.forEach(order=> {
            //next we get the productDetails for each usercart obj in an order record
            cart = order.userCart;
            promises.push(baseRequest.getProductDetails(cart.productId, cart.category)
                .then(product=>{
                    addProductDetailsToOrderList(productDetailList,refinedOrderList,order,product,cart);
                })
                .catch(err=>{
                    console.log("ERROR FETCHING PRODUCT DETAILS OF CART IN USER'S ORDERS" + err);
                    reject({success:false,code:500,message:"error fetching orders,couldn't get product detail"});
                }));
        });

        Promise.all(promises)
            .then(function () {
                resolve(refinedOrderList);
            })
            .catch(function (err) {
                reject(err);
            })
    })
}

function getProductOrdersAsAdmin(req,res) {
    return new Promise((resolve, reject) => {
        var param = validQueryParameters(req,res);
        if(param) {
            //to determine the  order  (asc/desc) in which the sortBy would be executed
            const sortBy = baseRequest.sortByAndOrderMapping(param.sortBy,param.order);
            const options = {page: param.pageNum, limit: param.pageSize,sort:sortBy};
            const aggregate = Order.aggregate();
            //group the data entries in order collection by their orderCode
            aggregate.group({_id: '$orderCode', orders: {$push: "$$ROOT"}});
            Order.aggregatePaginate(aggregate, options)
                .then(function (value) {
                    resolve({success:true, docs:value.data,pages:value.pageCount,total:value.totalCount})
                })
                .catch(function (err) {
                    reject({success: false, code: 500, message: "error fetching orders"});
                    console.log("ERROR FETCHING USER'S ORDERS" + err);
                })
        }
    });
}

function getProductOrdersAsProvider(req, res) {
    baseRequest.getProductOrders(req, res, {provider: req.params.providerName}).then(result => {
        return res.status(200).json(result)
    })
        .catch(error => {
            console.log(error);
            return res.status(500).json(error);
        });
}


function completeCheckoutProcess(req, res, PENDING_BEFORE_CHECKOUT, CHECK_OUT_COMPLETE, orderInfo, resolve, reject) {
    updateCartStatus(req, res, PENDING_BEFORE_CHECKOUT, CHECK_OUT_COMPLETE, resolve, reject).then(value => {
        resolve({success: true, code: 200, orderInfo: orderInfo})
        /* todo for auditing purposes we update the quantityOrdered field in  the product collection :)
        checkout process is seen as completed irrespective of result */
    }).catch(err => {
        //if we couldnt update status for some odd reasons throw error and fail operation
        console.log("COULDN'T UPDATE CART STATUS FROM PENDING_BEFORE_CHECKOUT TO FINAL" + err);
        reject({success: false, message: "Sorry, couldn't complete checkout process", code: 500});
    });
}


function prepareOrderResult(req, cartList) {
    var ordersList = [];
    const orderCode = randomstring.generate(10);
    const paymentId = req.body.paymentID || "PayOnDeliveryID";
    return new Promise((resolve, reject) => {
        cartList.forEach(cart => {
            let order = new Order({
                name: req.body.name,
                userId: req.params.userId,
                orderCode: orderCode,
                paymentID: paymentId,
                provider: cart.provider,
                paymentType: req.body.paymentType,
                userCart: cart
            });
            ordersList.push(order);
        });
        Order.collection.insert(ordersList, (err, docs) => {
            if (err) {
                reject({success: false, err, code: 500});
                console.log("ERROR CREATING ORDERS" + err);
            } else {
                resolve({success: true, code: 200, orderList: docs.ops});
            }
        })
    })
}


function createOrderRequest(req, res) {
    return new Promise((resolve, reject) => {
        const PENDING = "PENDING";
        const PENDING_BEFORE_CHECKOUT = "PENDING_BEFORE_CHECKOUT";//unsafe and volatile state
        const CHECK_OUT_COMPLETE = "CHECK_OUT_COMPLETE";
        //first get all the current user's cart ready for checkout
        getUsersCart(req, PENDING).then(carts => {
            if (!carts) {
                reject({success: false, message: "You have no product in your cart", code: 404});
            } else {
                //update the cart status from pending to pending_before_checkout !!
                updateCartStatus(req, res, PENDING, PENDING_BEFORE_CHECKOUT).then(value => {
                    //after updating cart status, find the updated ones, then create a new order request for each cart found in cartlist
                    getUsersCart(req, PENDING_BEFORE_CHECKOUT).then(newCarts => {
                        prepareOrderResult(req, newCarts).then(result => {
                            //if the order was successfully made, then prepare formatted response for user
                            const usersOrders = [];
                            const orderList = result.orderList;
                            if (orderList.length !== 0) {
                                orderList.forEach(order => {
                                    usersOrders.push(order.userCart);
                                });
                                var orderInfo = {
                                    name: orderList[0].name,
                                    userId: orderList[0].userId,
                                    orderCode: orderList[0].orderCode,
                                    paymentID: orderList[0].paymentId,
                                    paymentType: orderList[0].paymentType,
                                    usersOrders: usersOrders
                                };
                            }
                            //update the cart status from pending_before_checkout to checkout_complete !!,
                            // if there is a failure, the whole operation fails :(
                            completeCheckoutProcess(req, res, PENDING_BEFORE_CHECKOUT, CHECK_OUT_COMPLETE, orderInfo, resolve, reject);

                        }).catch(err => {
                            console.log("FAILED TO SAVE ORDERS" + JSON.stringify(err));
                            //if we couldn't save orders reverse status back to pending
                            updateCartStatus(req, res, PENDING_BEFORE_CHECKOUT, PENDING).then(value => {
                                reject({
                                    success: false,
                                    message: "CheckOut Process Failed, Please Try Again",
                                    code: 500
                                });
                            })
                        }).catch(err => {
                            console.log("COULDN'T FIND CART WITH STATUS PENDING_BEFORE_CHECKOUT" + err);
                            reject({success: false, message: err, code: 500});
                        })
                    }).catch(err => {
                        console.log("COULDN'T FIND CART WITH STATUS PENDING_BEFORE_CHECKOUT" + err);
                        reject({success: false, message: err, code: 500});
                    })
                }).catch(err => {
                    console.log("COULDN'T UPDATE CART STATUS FROM PENDING TO PENDING_BEFORE_CHECKOUT" + err);
                    reject({success: false, code: err.code, message: err.err})
                });
            }
        })
    });
}

module.exports = {
    getProductOrdersAsAdmin,
    updateSingleOrderDeliveryStatus,
    validateCreateOrderRequest,
    createOrderRequest,
    updateOrderDeliveryStatus,
    getProductOrdersAsProvider
};
