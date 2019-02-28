import PaginationFactory from './factory/createPaginationReducer';
import {combineReducers} from "redux";
import {FASHION_PRODUCT, RAW_MATERIALS_PRODUCT} from "../constants/ActionTypes";

 const fashionReducer = PaginationFactory(FASHION_PRODUCT);
 const rawMaterialReducer = PaginationFactory(RAW_MATERIALS_PRODUCT);
 const productCategoriesReducer = combineReducers({
    fashionCategory:fashionReducer,
    rawMaterialsCategory:rawMaterialReducer
});

 export default productCategoriesReducer;

