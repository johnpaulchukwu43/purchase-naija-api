import isEmpty from 'lodash/isEmpty';
import {GET_ERRORS, SET_CURRENT_USER} from "../constants/ActionTypes";

const initialState = {
    isAuthenticated: false,
    user: {}
};

export default (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                isAuthenticated: !isEmpty(action.user),
                user: action.user
            };
        case GET_ERRORS:
            return {
                error:action.payload
            };
        default:
            return state;
    }
}
