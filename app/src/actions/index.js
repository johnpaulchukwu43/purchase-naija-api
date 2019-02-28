import shop from '../api/shop'
import * as types from '../constants/ActionTypes'
import store from "../store";
import { toast  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import setPaginationFor from './factory/createPaginationAction';
import { FASHION_PRODUCTS_ENDPOINT, LOGIN_USER_ENDPOINT} from "../constants/endpoints";
import axios from "axios";
import {FASHION_PRODUCT} from "../constants/ActionTypes";
import {RAW_MATERIALS_PRODUCT} from "../constants/ActionTypes";

export const fetchProductsBegin = () => ({
    type: types.FETCH_PRODUCTS_BEGIN
});



export const receiveProducts = products => ({
    type: types.RECEIVE_PRODUCTS,
    products
});



export function getProductCategory(endpoint,product_category_name){

    return dispatch =>{
        // return axios.get(FASHION_PRODUCTS_ENDPOINT).then(res => {
        //     let data = [];
        //     shop.getProductsByCategory(product=>{
        //         data = product;
        //     });
        //
        //     // let starter = lastpoint || 0;
        //     // let productSize = 39;
        //     // let isDataleft = true;
        //     // let data = [];
        //     // let amountNeeded = parseInt(size) + starter;
        //     //     data = response.slice(starter,size)
        //     // }
        //     // else{
        //     //     isDataleft=false;
        //     // }
        //     // console.log(JSON.stringify(data));
        //     dispatch(setPaginationFor(FASHION_PRODUCT,{data}));
        // });
        switch(product_category_name){
            case FASHION_PRODUCT:
                return shop.getFashionCategoryProducts(data=>{
                    dispatch(setPaginationFor(product_category_name,{data}));
                    return data;
                });

            case RAW_MATERIALS_PRODUCT:
                return shop.getRawMaterialCategoryProducts(data=>{
                    dispatch(setPaginationFor(product_category_name,{data}));
                    return data;
                });

            default:
                return shop.getFashionCategoryProducts(data=>{
                    dispatch(setPaginationFor(product_category_name,{data}));
                    return data;
                });
        }


    };
}

export const getAllProducts = () => dispatch => {
    dispatch(fetchProductsBegin());
    shop.getProducts(products => {
        dispatch(receiveProducts(products));
        return products;
    })
}
export const fetchSingleProduct = productId => ({
    type: types.FETCH_SINGLE_PRODUCT,
    productId
});




//it seems that I should probably use this as the basis for "Cart"
export const addToCart = (product,qty) => (dispatch) => {
    toast.success("Item Added to Cart");
        dispatch(addToCartUnsafe(product, qty))

}
export const addToCartAndRemoveWishlist = (product,qty) => (dispatch) => {
    toast.success("Item Added to Cart");
    dispatch(addToCartUnsafe(product, qty));
    dispatch(removeFromWishlist(product));
}
export const addToCartUnsafe = (product, qty) => ({
    type: types.ADD_TO_CART,
    product,
    qty
});
export const removeFromCart = product_id => ({
    type: types.REMOVE_FROM_CART,
    product_id
});
export const incrementQty = (product,qty) => (dispatch) => {
    dispatch(addToCartUnsafe(product, qty))

}
export const decrementQty = productId => ({
    type: types.DECREMENT_QTY,
    productId
});



//it seems that I should probably use this as the basis for "Wishlist"
export const addToWishlist = (product) => (dispatch) => {
    toast.success("Item Added to Wishlist");
    dispatch(addToWishlistUnsafe(product))

}
export const addToWishlistUnsafe = (product) => ({
    type: types.ADD_TO_WISHLIST,
    product
});
export const removeFromWishlist = product_id => ({
    type: types.REMOVE_FROM_WISHLIST,
    product_id
});


//Compare Products
export const addToCompare = (product) => (dispatch) => {
    toast.success("Item Added to Compare");
    dispatch(addToCompareUnsafe(product))

}
export const addToCompareUnsafe= (product) => ({
    type: types.ADD_TO_COMPARE,
    product
});
export const removeFromCompare = product_id => ({
    type: types.REMOVE_FROM_COMPARE,
    product_id
});


// Filters
export const filterBrand = (brand) => ({
    type: types.FILTER_BRAND,
    brand
});
export const filterColor = (color) => ({
    type: types.FILTER_COLOR,
    color
});
export const filterPrice = (value) => ({
    type: types.FILTER_PRICE,
    value
});
export const filterSort = (sort_by) => ({
    type: types.SORT_BY,
    sort_by
});


// Currency
export const changeCurrency = (symbol) => ({
    type: types.CHANGE_CURRENCY,
    symbol
});

