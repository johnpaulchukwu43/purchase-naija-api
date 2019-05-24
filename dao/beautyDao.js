/*
 Created by Johnpaul Chukwu @ $
*/
const Beauty = require('../models/product_categories/BeautyProduct');
const baseRequest = require('../dao/baseRequest');
const checkBaseServerRequest = require('../common/validation').checkBaseServerRequest;
const saveRequestToDb = require('../dao/saveRequest');

function validateRequest(req, res) {
    if (checkBaseServerRequest(req, res)) {
        //do further validation unique to this category
        if (!req.body.brand) {
            res.status(400).json({success: false, message: 'Brand is required'});
        } else {
            if (!req.body.subCategory) {
                res.status(400).json({success: false, message: 'SubCategory is required'});
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

function createProduct(req, res) {
    //get base request and requests unique to this product category
    const request = Object.assign({}, baseRequest.getBaseRequest(req), {
        brand: req.body.brand,
        gender: req.body.gender,
        subCategory: req.body.subCategory
    });
    //save Request to Db
    saveRequestToDb(Beauty, request, res)
}

//get all beauty productts paginated
function getAllBeautyProducts(req, res) {
    baseRequest.getProductByCategory(req, res, {}, Beauty)
}

// get all beauty products by provider
function getAllBeautyProductsByProvider(req, res) {
    var query = {provider: req.query.provider};
    baseRequest.getProductByCategory(req, res, query, Beauty)

}

//search beauty products paginated by name
function searchBeautyProducts(req, res) {
    baseRequest.searchCategoryForProduct(req,res,Beauty);
}

function deleteBeautyProductById(req, res) {
    baseRequest.deleteProductByCategoryAndId(req, res, Beauty);
}

module.exports = {
    validateRequest,
    createProduct,
    getAllBeautyProducts,
    getAllBeautyProductsByProvider,
    searchBeautyProducts,
    deleteBeautyProductById
};
