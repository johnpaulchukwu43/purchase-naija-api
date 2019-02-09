import {GET_ERRORS, SET_CURRENT_USER} from "../constants/ActionTypes";
import setAuthorizationToken from "../utils/setAuthorizationToken";
import axios from "axios";
import jwtDecode from 'jwt-decode';

const BASE_PATH = "/api/v1";
const LOGIN_USER_ENDPOINT = `${BASE_PATH}/user/login`;
// const REGISTER_USER_ENDPOINT = `${BASE_PATH}/user/signup`;
const REGISTER_USER_ENDPOINT = "/user/signup";
const LOGIN_SERVICE_PR0_ENDPOINT = "/serviceProvider/login";
// const LOGIN_SERVICE_PR0_ENDPOINT = `${BASE_PATH}/serviceProvider/login`;
// const REGISTER_SERVICE_PR0_ENDPOINT =`${BASE_PATH}/serviceProvider/signup` ;
const REGISTER_SERVICE_PR0_ENDPOINT ="/serviceProvider/signup" ;
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
            const token = res.data.token;
            localStorage.setItem('jwtToken', token);
            setAuthorizationToken(token);
            dispatch(setCurrentUser(jwtDecode(token)));
        }).catch(err=>{
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        })
    }
}
export function userSignupRequest(userData) {
    return dispatch => {
        return axios.post(REGISTER_USER_ENDPOINT, userData);
    }
}
export function loginServiceProviderRequest(data) {
    return dispatch => {
        return axios.post(LOGIN_SERVICE_PR0_ENDPOINT, data).then(res => {
            const token = res.data.token;
            localStorage.setItem('jwtToken', token);
            setAuthorizationToken(token);
            dispatch(setCurrentUser(jwtDecode(token)));
        }).catch(err=>{
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        })
    }
}
export function SignUpServiceProviderRequest(userData) {
    return dispatch => {
        return axios.post(REGISTER_SERVICE_PR0_ENDPOINT, userData).then(res=>{}).catch(err=>{
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        });
    };
}
