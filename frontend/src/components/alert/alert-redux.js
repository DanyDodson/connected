import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ToastContainer, Flip } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <ToastContainer
      key={alert.id}
      draggable
      transition={Flip}
      closeButton={false}
      autoClose={3000}
      newestOnTop={true}
      position='top-center'
      pauseOnVisibilityChange={false}
      hideProgressBar={true} />
  ))

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
  alerts: state.alert
})

export default connect(mapStateToProps)(Alert)