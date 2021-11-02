import { SHOW_ALERT, HIDE_ALERT } from '../actions/type';

const INITIAL_STATE = {
  open: false,
  message: '',
  type: 'success'
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case SHOW_ALERT:
      return {...state, open: true, ...action.payload};
    case HIDE_ALERT:
      return {...state, open: false};
    default:
      return state;
  }
}