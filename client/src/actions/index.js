import { 
  SIGN_IN, 
  SIGN_OUT,
  SIGN_IN_WITH_SOCIAL,
  FETCH_CLASSES,
  CREATE_CLASS,
  FETCH_USER,
  SHOW_ALERT,
  HIDE_ALERT,
} from './type';
import axios from 'axios';
import axiosJWT from '../api/axiosJWT';
import history from '../history';
import _ from 'lodash';

export const signInWithSocial = (accessToken, url) => async (dispatch) => {
  try {
    const res = await axios.get(url, {
      headers: {
        access_token: accessToken
      }
    });
    dispatch ({
      type: SIGN_IN_WITH_SOCIAL,
      payload: res.data
    });
    history.push('/');
  } catch(err) {
    console.log(err);
  }
}

export const signIn = (formValues) => async (dispatch) => {
  try {
    const res = await axios.post('users/login', {
      email: formValues.emailLogin,
      password: formValues.passwordLogin
    });
    if(res.status === 200) {
      dispatch ({
        type: SIGN_IN,
        payload: res.data
      });
      history.push('/');
      dispatch(hideAlert("Welcome!", 'success'));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 3000);
    }
  } catch(err) {
    dispatch(showAlert(err.response.data.message, 'error'));
    setTimeout(() => {
      dispatch(hideAlert());
    }, 3000)
  }
}

export const signUp = (formValues) => async (dispatch) => {
  try {
    const res = await axios.post('/users/signup', formValues);
    if(res.status === 200) {
      dispatch(showAlert("Sign up success!", 'success'));
      setTimeout(() => {
        dispatch(hideAlert());
      }, 3000)
    }
  } catch(err) {
    dispatch(showAlert(err.response.data.message, 'error'));
    setTimeout(() => {
      dispatch(hideAlert());
    }, 3000)
  }
}

export const showAlert = (message, type) => {
  return {
    type: SHOW_ALERT,
    payload: {message: message, type: type}
  }
}

export const hideAlert = () => {
  return {
    type: HIDE_ALERT
  }
}

export const signOut = () => {
  history.push('/login');
  return {
    type: SIGN_OUT
  }
}

export const fetchClasses = () => async (dispatch) => {
  try {
    const res = await axiosJWT.get('/classes');
    dispatch ({
      type: FETCH_CLASSES,
      payload: res.data
    });
  } catch(err) {
    console.log(err);
  }
}

export const fetchUser = (userId) => async (dispatch) => _fetchUser(userId, dispatch);

const _fetchUser = _.memoize(async (userId, dispatch) => {
  try {
    const res = await axiosJWT.get(`/users/${userId}`);
    dispatch ({
      type: FETCH_USER,
      payload: res.data
    });
  } catch(err) {
    console.log(err);
  }
})

export const createClass = (formValues) => async (dispatch) => {
  try {
    const res = await axiosJWT.post('/classes', {
      ...formValues
    });
    dispatch ({
      type: CREATE_CLASS,
      payload: res.data
    });
  } catch(err) {
    console.log(err);
  }
}