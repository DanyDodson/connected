import passport from 'passport'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import logger from '../../loaders/logger'
import config from '../../config'
import { roles } from './roles'
import UserModel from '../../models/User'

export const setup = () => {

  passport.serializeUser((user, done) => done(null, user._id))

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id)
      return done(null, user)
    } catch (err) {
      return done(err, null)
    }
  })
}

export const setPassword = async password => {
  if (!password) throw new Error('password was not provided')
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const verifyPassword = async (candidate, actual) => {
  return await bcrypt.compare(candidate, actual)
}

export const signToken = user => {
  return jwt.sign({ data: user }, config.app.jwtSecret, {
    expiresIn: 604800
  })
}

export const getRedirectUrl = role => {
  switch (role) {
    case roles.admin:
      return '/admin-dashboard'
    case roles.vendor:
      return '/vendor-dashboard'
    case roles.customer:
      return '/customer-dashboard'
    default:
      return '/'
  }
}