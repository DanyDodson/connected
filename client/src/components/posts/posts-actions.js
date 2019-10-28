import axios from 'axios'

import {
  GET_POSTS,
  CLEAR_POSTS,
  CLEAR_PROFILES,
  CLEAR_PROFILE,
  POST_ERROR,
} from './posts-constants'

// Get posts
export const getPosts = () => async dispatch => {
  dispatch({ type: CLEAR_POSTS })
  dispatch({ type: CLEAR_PROFILE })
  dispatch({ type: CLEAR_PROFILES })

  try {
    const res = await axios.get('/api/posts');

    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusText,
        status: err.response.status
      }
    })
  }
}

