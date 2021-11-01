import _ from "lodash";
import 
{ 
  FETCH_CLASSES,
  FETCH_CLASS,
  UPDATE_CLASS,
  DELETE_CLASS,
  CREATE_CLASS 
} from "../actions/type";

// eslint-disable-next-line import/no-anonymous-default-export
export default (state={}, action) => {
  switch(action.type) {
    case FETCH_CLASSES:
      return {...state, ..._.mapKeys(action.payload, "_id")}
    case FETCH_CLASS:
      return {...state, [action.payload._id] : action.payload}
    case CREATE_CLASS:
      return {...state, [action.payload._id] : action.payload}
    case UPDATE_CLASS:
      return {...state, [action.payload._id]: action.payload}  
    case DELETE_CLASS:
      return _.omit(state, action.payload)
    default:
      return state;
  }
}