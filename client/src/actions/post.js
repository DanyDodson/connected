import axios from 'axios'
import { setAlert } from './alert'

import {
  GET_POSTS,
  CLEAR_POSTS,
  CLEAR_POST,
  // CLEAR_PROFILE,
  // CLEAR_PROFILES,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT
} from './types'

// Get posts
export const getPosts = () => async dispatch => {
  dispatch({ type: CLEAR_POST })
  // dispatch({ type: CLEAR_PROFILE })
  // dispatch({ type: CLEAR_PROFILES })

  try {
    const res = await axios.get('/api/posts')

    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  } catch (err) {

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Get posts
export const getFeed = () => async dispatch => {
  // dispatch({ type: CLEAR_POST })
  // dispatch({ type: CLEAR_PROFILE })
  // dispatch({ type: CLEAR_PROFILES })

  try {
    const res = await axios.get('/api/posts')

    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  } catch (err) {

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Add like
export const addLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`)

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    })

    dispatch(setAlert('See more by this user ?', 'success'))

  } catch (err) {

    if (err) {
      dispatch(setAlert(err.response.data.msg, 'error'))
    }

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Remove like
export const removeLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`)
    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    })
    dispatch(setAlert('Pin unliked', 'success'))
  } catch (err) {
    if (err) { dispatch(setAlert(err.response.data.msg, 'error')) }
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Delete post
export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`)

    dispatch({
      type: DELETE_POST,
      payload: id
    })

    dispatch(setAlert('Post Removed', 'success'))
  } catch (err) {
    if (err) { dispatch(setAlert(err.response.data.msg, 'error')) }
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
    dispatch(setAlert(err.response.statusText, 'error'))
  }
}

// Add post
export const addPost = formData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const res = await axios.post('/api/posts', formData, config)
    dispatch({
      type: ADD_POST,
      payload: res.data
    })

    dispatch(setAlert('Post Created', 'success'))

  } catch (err) {

    if (err) {
      dispatch(setAlert(err.response.data.msg, 'error'))
    }

    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })

  }
}

// Get post
export const getPost = id => async dispatch => {
  dispatch({ type: CLEAR_POSTS })

  try {
    const res = await axios.get(`/api/posts/${id}`)

    dispatch({
      type: GET_POST,
      payload: res.data
    })
  } catch (err) {
    if (err) {
      dispatch(setAlert(err.response.data.msg, 'error'))
    }
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Add comment
export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    const res = await axios
      .post(`/api/posts/${postId}/comments`, formData, config)

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    })

    dispatch(setAlert('Comment Added', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  try {
    await axios.delete(`/api/posts/${postId}/comments/${commentId}`)

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    })

    dispatch(setAlert('Comment Removed', 'success'))
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    })
  }
}
