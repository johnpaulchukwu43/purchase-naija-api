import {GET_ERRORS, SET_CURRENT_USER} from "../constants/ActionTypes";
import setAuthorizationToken from "../utils/setAuthorizationToken";
import axios from "axios";
import jwtDecode from 'jwt-decode';

const BASE_PATH = "/api/v1";
const LOGIN_USER_ENDPOINT = `${BASE_PATH}/user/login`;
const REGISTER_USER_ENDPOINT = `${BASE_PATH}/user/signup`;
const LOGIN_SERVICE_PR0_ENDPOINT = `${BASE_PATH}/serviceProvider/login`;
const REGISTER_SERVICE_PR0_ENDPOINT =`${BASE_PATH}/serviceProvider/signup` ;
//Auth
export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    };
}

export function logout() {
    return dispatch => {
        localStorage.removeItem('jwtToken');
        setAuthorizationToken(false);
        dispatch(setCurrentUser({}));
    }
}


export function login(data) {
    return dispatch => {
        return axios.post(LOGIN_USER_ENDPOINT, data).then(res => {
            saveCredentials(dispatch,res)
        }).catch(err=>{
            throwError(dispatch,err);
        })
    }
}
export function userSignupRequest(userData) {
    return dispatch => {
        return axios.post(REGISTER_USER_ENDPOINT, userData).then(res=>{}).catch(err=>{
            throwError(dispatch,err);
        });
    }
}
export function loginServiceProviderRequest(data) {
    return dispatch => {
        return axios.post(LOGIN_SERVICE_PR0_ENDPOINT, data).then(res => {
            saveCredentials(dispatch,res)
        }).catch(err=>{
            throwError(dispatch,err);
        })
    }
}
export function SignUpServiceProviderRequest(userData) {
    return dispatch => {
        return axios.post(REGISTER_SERVICE_PR0_ENDPOINT, userData).then(res=>{}).catch(err=>{
            throwError(dispatch,err);
        });
    };
}

const throwError = (dispatch,err)=>{
    dispatch({
        type: GET_ERRORS,
        payload: err.response.data
    });
};

const saveCredentials =(dispatch,res)=>{
    const token = res.data.token;
    localStorage.setItem('jwtToken', token);
    setAuthorizationToken(token);
    dispatch(setCurrentUser(jwtDecode(token)));
};
