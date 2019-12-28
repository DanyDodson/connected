import jwt from 'express-jwt'
import config from '../config'

function getTokenFromHeader (req) {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token'
    || req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1]
  }
  return null
}

export default {
  required: jwt({
    secret: config.app.jwtSecret,
    userProperty: 'payload',
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: config.app.jwtSecret,
    userProperty: 'payload',
    credentialsRequired: false,
    getToken: getTokenFromHeader
  })
}