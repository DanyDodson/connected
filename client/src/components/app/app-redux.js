import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Provider } from 'react-redux'
import store from '../../store'

import setAuthToken from '../../utils/set-token'
import jwt_decode from 'jwt-decode'

import {
  setCurrentUser,
  logoutUser,
  // clearCurrentProfile,
} from '../../actions/auth'

import Navbar from '../navbar'
import Landing from '../landing'
import Routes from '../routes/routes-view'
// import LogRocket from 'logrocket'
// import setupLogRocketReact from 'logrocket-react'

import './App.css'

// LogRocket.init('r5uhu6/seesee')
// setupLogRocketReact(LogRocket)

// LogRocket.identify('r5uhu6', {
//   name: 'Dany Dodson',
//   email: 'danydodson@gmail.com',
//   subscriptionType: 'pro'
// })

// Check for token
if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken)
  const decoded = jwt_decode(localStorage.jwtToken, { session: false })
  store.dispatch(setCurrentUser(decoded))

  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser())
    // store.dispatch(clearCurrentProfile())
    window.location.href = '/signin'
  }
}

const App = () => {

  useEffect(() => {
    // store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
    </Provider>
  )
}

export default App
