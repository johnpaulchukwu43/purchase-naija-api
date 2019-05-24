/*
 Created by Johnpaul Chukwu @ $
*/
var Fashion = require('../models/product_categories/FashionProduct');
var rawMaterials = require('../models/product_categories/RawmaterialProduct');
var Computer = require('../models/product_categories/ComputerProduct');
var Phones = require('../models/product_categories/PhonesProduct');
var Beauty = require('../models/product_categories/BeautyProduct');
var Electronics = require('../models/product_categories/ElectronicsProduct');
var Manufacturing = require('../models/product_categories/ManufacturingProduct');
const fashionCollection = 'fashions';
const rawMaterialCollection = 'rawmaterials';
const phoneCollection = 'phones';
const electronicCollections = 'electronics';
const manufacturingCollection = 'manufacturing';
const beautyCollection = 'beauties';
const computerCollection = 'computers';

const listOfCollections = [


];
const DECREMENT = 'DECREMENT';
const INCREMENT = 'INCREMENT';
const PENDING = 'PENDING';
const cartTypes = ['customer', 'guest'];

module.exports = {
    fashionCollection,
    phoneCollection,
    electronicCollections,
    manufacturingCollection,
    beautyCollection,
    computerCollection,
    rawMaterialCollection,
    listOfCollections,
    cartTypes,
    INCREMENT,
    DECREMENT,
    PENDING

};
