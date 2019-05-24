/*
 Created by Johnpaul Chukwu @ $
*/
const Computer = require('../models/product_categories/ComputerProduct');
const baseRequest = require('../dao/baseRequest');
const checkBaseServerRequest = require('../common/validation').checkBaseServerRequest;
const saveRequestToDb = require('../dao/saveRequest');
const DEFAULT = "default";

//validate request fror create fashion product
function validateRequest(req, res) {
    if (checkBaseServerRequest(req, res)) {
        //do further validation unique to this category
        return true;
    }
}

//create Computer product
function createProduct(req, res) {
    //get base request and requests unique to this product category
    const request = Object.assign({}, baseRequest.getBaseRequest(req), {
        brand: req.body.brand || DEFAULT,
        os: req.body.os || DEFAULT,
        screen: req.body.screen || DEFAULT,
        ram: req.body.ram || DEFAULT,
        processor: req.body.processor || DEFAULT,
        memorySpace: req.body.memorySpace || DEFAULT,
    });
    //save Request to Db
    saveRequestToDb(Computer, request, res)
}

//get all Computer products paginated
function getAllComputerProducts(req,res) {
    baseRequest.getProductByCategory(req,res,{},Computer)
}

// get all Computer products by provider
function getAllComputerProductsByProvider(req,res){
    var query = {provider:req.query.provider};
    baseRequest.getProductByCategory(req,res,query,Computer)

}
//search Computer products paginated by name
function searchComputerProducts(req, res) {
    baseRequest.searchCategoryForProduct(req,res,Computer);
}

function deleteComputerProductById(req,res){
    baseRequest.deleteProductByCategoryAndId(req,res,Computer);
}

module.exports = {
    validateRequest,
    createProduct,
    getAllComputerProducts,
    searchComputerProducts,
    getAllComputerProductsByProvider,
    deleteComputerProductById

};
