import { SIGN_IN, SIGN_OUT, SIGN_IN_WITH_SOCIAL } from "../actions/type";

const INITIAL_STATE = {
  currentUser: null,
  isSignedIn: false,
  accessToken: null,
  refreshToken: null,
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state={INITIAL_STATE}, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {...state, currentUser: action.payload.user, isSignedIn: true, ...action.payload};
    case SIGN_OUT:
      return {...state, currentUser: null, isSignedIn: false, accessToken: null, refreshToken: null};
    case SIGN_IN_WITH_SOCIAL:
      return {...state, currentUser: action.payload.user, isSignedIn: true, ...action.payload};
    default:
      return state;
  }
}