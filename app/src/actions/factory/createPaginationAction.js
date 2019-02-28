import * as types from "../../constants/ActionTypes";

const setPaginationFor = (prefix,response) => {
    console.log("type set is: "+prefix + types.SET_CATEGORY_TYPE);
        return {
            type: prefix + types.SET_CATEGORY_TYPE,
            payload: response
        };
};

export default setPaginationFor;