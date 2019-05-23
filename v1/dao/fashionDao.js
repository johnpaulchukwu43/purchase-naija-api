/*
 Created by Johnpaul Chukwu @ $
*/
const Fashion = require('../models/product_categories/FashionProduct');
const baseRequest = require('../dao/baseRequest');
const checkBaseServerRequest = require('../common/validation').checkBaseServerRequest;
const saveRequestToDb = require('../dao/saveRequest');
const query = require('../dbqueries/index');
var appendToObject = require('../common/util').appendToObject;


//validate request fror create fashion product
function validateRequest(req, res) {
    if (checkBaseServerRequest(req, res)) {
        //do further validation unique to this category
        if (!req.body.brand) {
            res.status(400).json({success: false, message: 'Brand is required'});
        } else {
            if (!req.body.size) {
                res.status(400).json({success: false, message: 'Size is required'});
            } else {
                if (!req.body.gender) {
                    res.status(400).json({success: false, message: 'Gender is required'});
                } else {
                    return true;
                }
            }
        }
    }
}

//create fashion product
function createProduct(req, res) {
    //get base request and requests unique to this product category
    const request = Object.assign({}, baseRequest.getBaseRequest(req), {
        brand: req.body.brand,
        gender: req.body.gender,
        size: req.body.size,
        subCategory: req.body.subCategory
    });
    //save Request to Db
    saveRequestToDb(Fashion, request, res)
}

//get all fashion productts paginated
function getAllFashionProducts(req,res) {
    var colorQuery;
    var brandQuery;
    var queries = {};

    if(req.query.colors){
        colorQuery = query.byColorRange(req.query.colors.split(','));
        queries = appendToObject(colorQuery,queries);
    }

    if(req.query.brands){
        brandQuery = query.byBrandRange(req.query.brands.split(','));
        queries = appendToObject(brandQuery,queries);
    }

    queries = appendToObject(query.getProductInStock(),queries);

    baseRequest.getProductByCategory(req,res,queries,Fashion)
}

// get all fashion products by provider
function getAllFashionProductsByProvider(req,res){
    var query = {provider:req.query.provider};
    baseRequest.getProductByCategory(req,res,query,Fashion)
}


//search fashion products by name
function searchFashionProducts(req, res) {
    baseRequest.searchCategoryForProduct(req,res,Fashion);
}

function deleteFashionProductById(req,res){
    baseRequest.deleteProductByCategoryAndId(req,res,Fashion);
}

module.exports = {
    validateRequest,
    createProduct,
    getAllFashionProducts,
    searchFashionProducts,
    getAllFashionProductsByProvider,
    deleteFashionProductById

};
