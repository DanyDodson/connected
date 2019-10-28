import {
  GET_POSTS,
  CLEAR_POSTS,
  // POST_ERROR,
} from './posts-constants'

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
}

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false
      }
    case CLEAR_POSTS:
      return {
        ...state,
        posts: [],
        loading: false
      }
    default:
      return state
  }
}
