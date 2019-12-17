import axios from 'axios'
import { setAlert } from './alert'

import {
  FOLLOW_USER,
  UNFOLLOW_USER.
  USER_ERROR.
} from './types'

export const follow = (userId, followId) => async dispatch => {
  try {
    const res = await axios.get('/api/user/follow')
    dispatch({
      type: FOLLOW_USER,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    })
  }
}

export const follow = (userId, followId) => async dispatch => {
  try {
    const res = await axios.get(`/api/user/${followId}unfollow`)
    dispatch({
      type: UNFOLLOW_USER,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    })
  }
}
