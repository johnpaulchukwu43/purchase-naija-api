/*
 Created by Johnpaul Chukwu @ $
*/
const Electronics = require('../models/product_categories/ElectronicsProduct');
const baseRequest = require('../dao/baseRequest');
const checkBaseServerRequest = require('../common/validation').checkBaseServerRequest;
const query = require('../dbqueries/index');
var appendToObject = require('../common/util').appendToObject;
const saveRequestToDb = require('../dao/saveRequest');

//validate request fror create electronics product
function validateRequest(req, res) {
    if (checkBaseServerRequest(req, res)) {
        //do further validation unique to this category
        if (!req.body.brand) {
            res.status(400).json({success: false, message: 'Brand is required'});
        } else {
            if (!req.body.size) {
                res.status(400).json({success: false, message: 'Size is required'});
            } else {
                return true;
            }
        }
    }
}

//create electronics product
function createProduct(req, res) {
    //get base request and requests unique to this product category
    const request = Object.assign({}, baseRequest.getBaseRequest(req), {
        brand: req.body.brand,
        size: req.body.size,
        subCategory: req.body.subCategory
    });
    //save Request to Db
    saveRequestToDb(Electronics, request, res)
}

//get all electronics productts paginated
function getAllElectronicProducts(req,res) {
    var brandQuery;
    var colorQuery;
    var queries = {};
    if(req.query.brands){
        brandQuery = query.byBrandRange(req.query.brands.split(','));
        queries = appendToObject(brandQuery,queries);
    }

    if(req.query.colors){
        colorQuery = query.byColorRange(req.query.colors.split(','));
        queries = appendToObject(colorQuery,queries);
    }
    baseRequest.getProductByCategory(req,res,queries,Electronics)
}

// get all electronics products by provider
function getAllElectronicProductsByProvider(req,res){
    var query = {provider:req.query.provider};
    baseRequest.getProductByCategory(req,res,query,Electronics)

}
//search electronics products paginated by name
function searchElectronicProducts(req, res) {
    baseRequest.searchCategoryForProduct(req,res,Electronics);
}

function deleteElectronicProductById(req,res){
    baseRequest.deleteProductByCategoryAndId(req,res,Electronics);
}

module.exports = {
    validateRequest,
    createProduct,
    getAllElectronicProducts,
    searchElectronicProducts,
    getAllElectronicProductsByProvider,
    deleteElectronicProductById

};
