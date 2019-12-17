import { toast } from 'react-toastify'
import uuid from 'uuid'

import {
  SET_ALERT,
  REMOVE_ALERT
} from './types'

export const setAlert = (msg, type, timeout = 3100) => dispatch => {
  const id = uuid.v4()

  dispatch({
    type: SET_ALERT,
    payload: { msg, type, id }
  })

  toast(msg, { type: type, id: id })

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout)
}

