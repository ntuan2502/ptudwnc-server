import {
  FETCH_USERS,
  FETCH_USER
} from '../actions/type';
import _ from 'lodash';

// eslint-disable-next-line import/no-anonymous-default-export
export default (state={}, action) => {
  switch(action.type) {
    case FETCH_USERS:
      return {...state, ..._.mapKeys(action.payload, '_id')};
    case FETCH_USER:
      return {...state, [action.payload._id]: action.payload};
    default:
      return state;
  }
}