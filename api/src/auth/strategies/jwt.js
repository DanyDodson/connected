import passport from 'passport'
import passportJWT from 'passport-jwt'
import { to } from 'await-to-js'
import config from '../../config'

import { getUserById } from '../../database/user'
import { signToken } from '../utilities'

const JWTStrategy = passportJWT.Strategy

const strategy = () => {

  const strategyOptions = {
    jwtFromRequest: req => req.cookies.jwt,
    secretOrKey: config.app.jwtSecret,
    passReqToCallback: true
  }

  const verifyCallback = async (req, jwtPayload, cb) => {
    const [err, user] = await to(getUserById(jwtPayload.data._id))
    if (err) return cb(err)
    req.user = user
    return cb(null, user)
  }

  passport.use(new JWTStrategy(strategyOptions, verifyCallback))
}

const login = (req, user) => {
  req.login(user, { session: false }, err => {
    if (err) return err
    return signToken(user)
  })
}

export { strategy, login }
