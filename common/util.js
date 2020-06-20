/*
 Created by Johnpaul Chukwu @ $
*/

function appendToObject(field,object){
    return Object.assign({},field ,object);
}

function isString(x) {
    return Object.prototype.toString.call(x) === '[object String]';
}

function isArray(x) {
    return Array.isArray(x);
}

module.exports = {
    appendToObject,
    isString,
    isArray
};
