import jwt from 'jsonwebtoken'
import config from '../../config'

export const setAuthToken = (payload = {}) => {
  const options = {
    issuer: 'seesee_api',
    subject: 'user_auth',
    expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
  }
  return jwt.sign(
    payload,
    config.app.jwtSecret,
    options
  )
}

export const setVerifyEmailToken = (payload = {}) => {
  const options = {
    issuer: 'seesee_api',
    subject: 'verify_email',
    expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
  }
  return jwt.sign(
    payload,
    config.app.jwtSecret,
    options
  )
}

export const setForgotPasswordToken = (payload = {}) => {
  const options = {
    issuer: 'seesee_api',
    subject: 'forgot_password',
    expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
  }
  return jwt.sign(
    payload,
    config.app.jwtSecret,
    options
  )
}