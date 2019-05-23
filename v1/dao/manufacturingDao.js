/*
 Created by Johnpaul Chukwu @ $
*/
const baseRequest = require('../dao/baseRequest');
const checkBaseServerRequest = require('../common/validation').checkBaseServerRequest;
const saveRequestToDb = require('../dao/saveRequest');
const Manufacturing = require('../models/product_categories/ManufacturingProduct');


function validateRequest(req, res) {
    if (checkBaseServerRequest(req, res)) {
        return true;
    }
}

function createProduct(req, res) {

    //get base request and requests unique to this product category
    const request = Object.assign({},baseRequest.getBaseRequest(req) ,{
        subCategory: req.body.subCategory
    });
    //save Request to Db
    saveRequestToDb(Manufacturing,request,res)
}

//get all manufacturing productts paginated
function getAllManufacturingProducts(req,res) {
    baseRequest.getProductByCategory(req,res,{},Manufacturing)
}

// get all manufacturing products by provider
function getAllManufacturingProductsByProvider(req,res){
    var query = {provider:req.query.provider};
    baseRequest.getProductByCategory(req,res,query,Manufacturing)

}

//search manufacturing products paginated by name
function searchManufacturingProducts(req, res) {
    baseRequest.searchCategoryForProduct(req,res,Manufacturing);
}


function deleteManufacturingProductById(req,res){
    baseRequest.deleteProductByCategoryAndId(req,res,Manufacturing);
}

module.exports = {
    validateRequest,
    createProduct,
    getAllManufacturingProducts,
    getAllManufacturingProductsByProvider,
    searchManufacturingProducts,
    deleteManufacturingProductById
};
