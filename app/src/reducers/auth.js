import isEmpty from 'lodash/isEmpty';
import {
    CREATE_PROVIDER_SUCCESSFUL,
    CREATE_USER_SUCCESSFUL,
    GET_ERRORS,
    SET_CURRENT_USER
} from "../constants/ActionTypes";

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

         case CREATE_USER_SUCCESSFUL:
             return{
                 isRegistered: true,
                 message:"Created User Successfully"
             };
        case CREATE_PROVIDER_SUCCESSFUL:
            return{
                isRegistered: true,
                message:"Created Provider Successfully"
            };

        default:
            return state;
    }
}
