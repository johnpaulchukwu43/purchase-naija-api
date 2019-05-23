/*
 Created by Johnpaul Chukwu @ $
*/
const baseRequest = require('../dao/baseRequest');
const checkBaseServerRequest = require('../common/validation').checkBaseServerRequest;
const saveRequestToDb = require('../dao/saveRequest');
const Rawmaterial = require('../models/product_categories/RawmaterialProduct');


function validateRequest(req, res) {
    if (checkBaseServerRequest(req, res)) {
        return true;
    }
}

function createProduct(req, res) {
    var request = baseRequest.getBaseRequest(req);
    //save Request to Db
    saveRequestToDb(Rawmaterial,request,res)

}
//get all rawMaterial productts paginated
function getAllRawMaterialProducts(req,res) {
    baseRequest.getProductByCategory(req,res,{},Rawmaterial)
}

// get all RawMaterial products by provider
function getAllRawMaterialProductsByProvider(req,res){
    var query = {provider:req.query.provider};
    baseRequest.getProductByCategory(req,res,query,Rawmaterial)

}

//search RawMaterial products paginated by name
function searchRawMaterialProducts(req, res) {
    baseRequest.searchCategoryForProduct(req,res,Rawmaterial);
}

function deleteRawMaterialProductById(req,res){
    baseRequest.deleteProductByCategoryAndId(req,res,Rawmaterial);
}

module.exports = {
    validateRequest,
    createProduct,
    getAllRawMaterialProducts,
    getAllRawMaterialProductsByProvider,
    searchRawMaterialProducts,
    deleteRawMaterialProductById
};
