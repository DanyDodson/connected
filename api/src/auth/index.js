import * as utilities from './utilities'
import * as strategies from './strategies'

const pipe = (...functions) => args => functions.reduce((arg, fn) => fn(arg), args)

const initialiseAuthentication = app => {

  // utilities.setup()

  pipe(
    // strategies.LocalStrategy,
    strategies.JWTStrategy
  )(app)

}

export { utilities, initialiseAuthentication, strategies }


// import config from '../config'
// import User from '../models/User'
// import passport from 'passport'

// import * as JwtStrategy from 'passport-jwt'
// import * as ExtractJwt from 'passport-jwt'
// import * as LocalStrategy from 'passport-jwt'

// const secret = config.app.jwtSecret
// const expiration = config.app.jwtExpiration
// const localOpts = { usernameField: 'email', session: false }
// // const jwtOpts = { jwtFromRequest: ExtractJwt.fromAuthHeader, secretOrKey: secret }
// const jwtOpts = { jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken, secretOrKey: secret }

// export default {

//   passport: () => {

//     const localLogin = new LocalStrategy(localOpts, async (email = '', password = '', done) => {

//       const user = await User.find({ email: email })
//       const isValid = await user.validPassword(password)

//       if (!isValid) return done(err, false)

//       if (user) {
//         return done(null, user)
//       } else {
//         return done(null, false, { message: 'invalid username or password' })
//       }
//     })

//     const jwtLogin = new JwtStrategy.Strategy(jwtOpts, (payload, done) => done(null, payload))

//     passport.use(jwtLogin)
//     passport.use(localLogin)
//     return passport

//   },

//   opts: {
//     secret: secret,
//     expiration: expiration,
//   },

// }

