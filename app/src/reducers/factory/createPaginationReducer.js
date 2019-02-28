import * as types from "../../constants/ActionTypes";

const initialPaginationState = {
    startElement: 0,
    pageSize: 100,
    count: 0,
    data:[],
    isDataleft:true,
    symbol: '₦',
    product_details: []
};
const paginationReducerFor = (prefix) => {
    const paginationReducer = (state = initialPaginationState, action) => {
        const { type, payload } = action;
        switch (type) {
            case prefix + types.SET_CATEGORY_TYPE:
                return Object.assign({}, state, {
                    data:payload.data,
                    isDataleft:payload.isDataleft,
                    lastpoint:payload.lastpoint
                });
            default:
                return state;
        }
    };
    return paginationReducer;
};

export default paginationReducerFor
