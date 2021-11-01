import axios from 'axios';
import store from '../myStore';
import jwtDecode from 'jwt-decode';
import { SIGN_OUT } from '../actions/type';

const axiosJWT = axios.create();

//axiosJWT.defaults.headers.common['Authorization'] = `Bearer ${store.getState().auth.accessToken}`;

// approve 1
axiosJWT.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${store.getState().auth.accessToken}`;
    let currentDate = new Date();
    const decodeToken = jwtDecode(store.getState().auth.accessToken);
    if(decodeToken.exp * 1000 < currentDate.getTime()) {
      // or refresh token
      store.dispatch({
        type: SIGN_OUT
      });
      return false;
    }
    return config;
  }, (err) => {
    return Promise.reject(err);
  }
)

export default axiosJWT;

// approve 2 refresh token when expired