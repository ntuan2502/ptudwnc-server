import { combineReducers } from "redux";
import authReducer from "./authReducer";
import classReducer from './classReducer';
import userReducer from './userReducer';

export default combineReducers({
  auth: authReducer,
  classes: classReducer,
  users: userReducer
});