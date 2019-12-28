import config from '../config'
import jwt from 'jsonwebtoken'

export const setAuthToken = (payload = {}) => {
  const options = {
    issuer: 'seesee.com',
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
    issuer: 'seesee.com',
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
    issuer: 'seesee.com',
    subject: 'forgot_password',
    expiresIn: Math.floor(Date.now() / 1000) + (60 * 60)
  }
  return jwt.sign(
    payload,
    config.app.jwtSecret,
    options
  )
}

