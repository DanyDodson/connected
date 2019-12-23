import { USER_LOADED } from '../actions/types'

const initialState = {
  loading: true,
  user: null
}

export default function(state = initialState, action) {
  const { type, payload } = action

  switch (type) {

    case USER_LOADED:
      return {
        ...state,
        loading: false,
        user: payload
      }

    default:
      return state
  }
}
