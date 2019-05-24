/*
 Created by Johnpaul Chukwu @ $
*/
const Phone = require('../models/product_categories/PhonesProduct');
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

//create fashion product
function createProduct(req, res) {
    //get base request and requests unique to this product category
    const request = Object.assign({}, baseRequest.getBaseRequest(req), {
        brand: req.body.brand || DEFAULT,
        size:req.body.size|| DEFAULT,
        screenSize: req.body.screenSize || DEFAULT,
        cameraQuality: req.body.cameraQuality|| DEFAULT,
        ram: req.body.ram|| DEFAULT,
        batteryPower: req.body.batteryPower|| DEFAULT,
        internalMemory: req.body.internalMemory|| DEFAULT,
        simSlotNumber: req.body.simSlotNumber|| DEFAULT,
    });
    //save Request to Db
    saveRequestToDb(Phone, request, res)
}

//get all Phone productts paginated
function getAllPhoneProducts(req,res) {
    baseRequest.getProductByCategory(req,res,{},Phone)
}

// get all fashion products by provider
function getAllPhoneProductsByProvider(req,res){
    var query = {provider:req.query.provider};
    baseRequest.getProductByCategory(req,res,query,Phone)

}
//search fashion products paginated by name
function searchPhoneProducts(req, res) {
    baseRequest.searchCategoryForProduct(req,res,Phone);
}

function deletePhoneProductById(req,res){
    baseRequest.deleteProductByCategoryAndId(req,res,Phone);
}

module.exports = {
    validateRequest,
    createProduct,
    getAllPhoneProducts,
    searchPhoneProducts,
    getAllPhoneProductsByProvider,
    deletePhoneProductById

};
