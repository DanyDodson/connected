import {
  // REGISTER_SUCCESS,
  REGISTER_FAIL,
  // USER_LOADED,
  // AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SET_CURRENT_USER,
} from './types'

import setAuthToken from '../utils/set-token'
import jwt_decode from 'jwt-decode'
import axios from 'axios'

import { setAlert } from './alert'

// register user
export const registerUser = (userData, history) => async dispatch => {
  await axios.post('/api/auth/signup', userData)
    .then(res => history.push('/signin'))
    .catch(err => dispatch({ type: REGISTER_FAIL, payload: err }))
}

// login - get user token
export const loginUser = userData => async dispatch => {
  await axios.post('/api/auth/signin', userData)
    .then(res => {
      const { authToken } = res.data
      localStorage.setItem('jwtToken', authToken)
      setAuthToken(authToken)
      const decoded = jwt_decode(authToken)
      dispatch(setCurrentUser(decoded))
      dispatch({ type: LOGIN_SUCCESS })
    })
    .catch(err => {
      const errors = err.response.data.errors
      if (errors) errors.forEach(error => dispatch(setAlert(error.msg, 'error')))
      dispatch({ type: LOGIN_FAIL })
    })
}

// set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// log user out
export const logoutUser = () => dispatch => {
  localStorage.removeItem('jwtToken')
  setAuthToken(false)
  dispatch(setCurrentUser({}))
}