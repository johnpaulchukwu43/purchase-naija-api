import { combineReducers } from 'redux';
import { IntlReducer as Intl, IntlProvider } from 'react-redux-multilingual'

// Import custom components
import productReducer from './products';
import cartReducer from './cart';
import filtersReducer from './filters';
import wishlistReducer from './wishlist';
import authReducer from './auth'
import compareReducer from './compare';
import productCategoriesReducer from "./product_categories";


const rootReducer = combineReducers({
    data: productReducer,
    cartList: cartReducer,
    auth:authReducer,
    filters: filtersReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    categories:productCategoriesReducer,
    Intl
});

export default rootReducer;
