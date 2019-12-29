import isEmpty from '../utils/is-empty'

import {
  // REGISTER_SUCCESS,
  // REGISTER_FAIL,
  SET_CURRENT_USER,
  // AUTH_ERROR,
  LOGIN_SUCCESS,
  // LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED
} from '../actions/types'

const initialState = {
  token: localStorage.getItem('jwtToken'),
  isAuthenticated: null,
  loading: true,
  payload: {},
}

export default function(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_CURRENT_USER:
      localStorage.setItem('jwtToken', action.payload)
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        payload: payload,
        // token: token,
      }

    // case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false
      }

    // case REGISTER_FAIL:
    // case AUTH_ERROR:
    // case LOGIN_FAIL:
    case LOGOUT:
    case ACCOUNT_DELETED:
      localStorage.removeItem('jwtToken')
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      }

    default:
      return state
  }
}
