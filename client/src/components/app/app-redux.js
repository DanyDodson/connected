import React, { Fragment, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../store'
import setToken from '../../utils/set-token'
import { loadUser } from '../../actions/auth'
import Navbar from '../navbar'
import Landing from '../landing'
import Routes from '../routes/routes-view'

import './App.css'

if (localStorage.token) {
  setToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
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
