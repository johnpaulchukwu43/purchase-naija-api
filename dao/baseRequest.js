var randomstring = require("randomstring");
var appendToObject = require("../common/util").appendToObject;
var validQueryParameters = require('../common/validation').validQueryParameters;
var queryByPriceRange = require('../dbqueries/index').queryByPriceRange;
const order_fields = ['ASC', 'DESC'];
const CREATED_AT_DESC = "-createdAt";

var Order = require('../models/order');
var Fashion = require('../models/product_categories/FashionProduct');
var rawMaterials = require('../models/product_categories/RawmaterialProduct');
var Computer = require('../models/product_categories/ComputerProduct');
var Phones = require('../models/product_categories/PhonesProduct');
var Beauty = require('../models/product_categories/BeautyProduct');
var Electronics = require('../models/product_categories/ElectronicsProduct');
var Manufacturing = require('../models/product_categories/ManufacturingProduct');
var constants = require('../common/constants');

function syncCollectionWithElasticSearch(collection,collectionFriendlyName){
    console.log("Creating Elastic Search Mapping for"+collectionFriendlyName+"Collection");
    var config = {
        "analysis": {
            "analyzer": {
                "edge_ngram_analyzer": {
                    "filter": [
                        "lowercase",
                        "asciifolding",
                        "edgeNGram_filter"
                    ],
                    "tokenizer": "edge_ngram_tokenizer"
                }
            },
            "filter": {
                "edgeNGram_filter": {
                    "type": "edgeNGram",
                    "min_gram": 2,
                    "max_gram": 20,
                    "side": "front"
                }
            },
            "tokenizer": {
                "edge_ngram_tokenizer": {
                    "type": "edge_ngram",
                    "min_gram": 2,
                    "max_gram": 5,
                    "token_chars": [
                        "letter"
                    ]
                }
            }
        }
    };


    collection.createMapping(config,(err,mapping)=>{
            if(err)
                console.log("Error Creating Elastic Search Mapping for "+collectionFriendlyName+" Collection: "+err);
            else {
                console.log("Mapping Created for " + collectionFriendlyName + " Collection");
                console.log("Synchronizing Products in " + collectionFriendlyName + "Collection to ElasticSearch");
                console.log('*********************************************************');
                var stream = collection.synchronize();
                var count = 0;

                stream.on('data', () => {
                    count++;
                });

                stream.on('close', () => {
                    console.log("Successfully Synchronized (" + count + ") Products in " + collectionFriendlyName + "Collection to ElasticSearch");
                });

                stream.on('error', () => {
                    console.log("Error Synchronizing Product in " + collectionFriendlyName + "Collection to ElasticSearch at count:" + count);
                });
            }
    })
}

function syncCollectionsWithElasticSearch(){
    syncCollectionWithElasticSearch(Fashion,'Fashion');
    syncCollectionWithElasticSearch(rawMaterials,'rawMaterials');
    syncCollectionWithElasticSearch(Computer,'Computer');
    syncCollectionWithElasticSearch(Phones,'Phones');
    syncCollectionWithElasticSearch(Beauty,'Beauty');
    syncCollectionWithElasticSearch(Electronics,'Electronics');
    syncCollectionWithElasticSearch(Manufacturing,'Manufacturing');
}

function searchAllCategoriesForProduct(req){
    var promises = [];
    var models =[
        Fashion,
        rawMaterials,
        Computer,
        Phones,
        Beauty,
        Electronics,
        Manufacturing
    ];
    var listOfProducts =[];
    return new Promise((resolve,reject)=>{
        models.forEach(model=>{
            promises.push(performSearchAction(req,model).then(results=>{
                if(results.length > 0)
                    results.forEach(result=>{
                        listOfProducts.push(result);
                    });
            }))
        });

        Promise.all(promises)
            .then(function () {
                resolve(listOfProducts);
            })
            .catch(function (err) {
                reject(err);
            })
    })
}

function searchCategoryForProduct(req,res,Model){
    performSearchAction(req,Model).then(result=>{
        if(result.length >0)
            return res.status(200).json({success:true,message:"Match Found",result});
        else{
            return res.status(200).json({success:true,message:"No product found"})
        }
    }).catch(err=>{
        return res.status(500).json({success:false,err})
    });
}

function performSearchAction(req,Model){
    return new Promise((resolve,reject)=>{
        var searchTerm = req.query.searchTerm;
        Model.search({
            query_string: {query:searchTerm}
        },(err,results)=>{
            if(err)
                reject(err);
            else{
                var data =results.hits.hits;
                resolve(data)
            }
        })
    });
}
function getBaseRequest(req){
  return {
    name: req.body.name,
    provider: req.body.provider,
    price: req.body.price,
    description: req.body.description,
    productCode: randomstring.generate(10),
    imageUrls: req.body.imageUrls,
    quantity: req.body.quantity,
    colors: req.body.colors
  };
}

function getCategoryCollectionModel(category) {
    var model = null;
    switch (category) {
        case constants.fashionCollection:
            model = Fashion;
            break;
        case constants.rawMaterialCollection:
            model = rawMaterials;
            break;
        case constants.phoneCollection:
            model = Phones;
            break;
        case constants.manufacturingCollection:
            model = Manufacturing;
            break;
        case constants.electronicCollections:
            model = Electronics;
            break;
        case constants.beautyCollection:
            model = Beauty;
            break;
        case constants.computerCollection:
            model = Computer;
            break;
        default:

            break;
    }
    return model;
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

function getProductByCategory(req,res,query,productType){
     if(validQueryParameters(req,res)){
         //what our base query does is to get products with quantity >0 and products with providerStatus of active
         var baseQueries = appendToObject({
             'providerStatus':'ACTIVE',
             'quantity':{$gt:0},
         },query);
         var param = validQueryParameters(req,res);
         //to determine the  order  (asc/desc) in which the sortBy would be executed
         var sortBy = sortByAndOrderMapping(param.sortBy,param.order);
         // construct price filter if price range exists
         if(param.priceRange)
         //append to our base query object
           baseQueries = appendToObject(queryByPriceRange(param.priceRange),query);
         //query for result
         console.log("base enquiry"+JSON.stringify(baseQueries));
         productType.paginate(baseQueries, {page: param.pageNum, limit:param.pageSize,sort:sortBy})
             .then(function (result) {
                 return res.status(200).json(result)
             }).catch(function (error) {
             console.log(error);
             return res.status(500).json(error);
         })
     }
}

function getProductOrders(req,res,query){
    if(validQueryParameters(req,res)){
        var param = validQueryParameters(req,res);
        //to determine the  order  (asc/desc) in which the sortBy would be executed
        var sortBy = sortByAndOrderMapping(param.sortBy,param.order);
        return Order.paginate(query, {page: param.pageNum, limit:param.pageSize,sort:sortBy});
    }
}

function sortByAndOrderMapping(sortBy,order){
    //if there is a sortby specified
    if(sortBy){
        //if it is order in ascending order
        if(order === order_fields[0]){
            return sortBy;
        }
        //then it must be descending order
        return "-"+sortBy;
    }
    //if there is no sortby specified then set a default
    else{
        return CREATED_AT_DESC;
    }

}


function deleteProductByCategoryAndId(req,res,productType){
    productType.findOneAndDelete({_id: req.params.id}).then(function (done) {
        if(done){
            res.status(200).json({success: true, message: 'Product was successfully deleted'});
        }else{
            res.status(400).json({success: false, message: 'Product Id does not exist'});
        }
    }).catch(function(err){
        res.status(500).json({success: false, message:'An error occurred. Try again later.'});
        console.log(err.message);
    });
}



module.exports = {
  getBaseRequest,
   getProductByCategory,
    deleteProductByCategoryAndId,
    getProductOrders,
    getProductDetails,
    sortByAndOrderMapping,
    searchAllCategoriesForProduct,
    searchCategoryForProduct,
    prepareCartResult,
    syncCollectionsWithElasticSearch,
    getCategoryCollectionModel

};
