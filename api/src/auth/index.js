import passport from 'passport'
import LocalStrategy from 'passport-local'
import User from '../models/User'

export default passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
  (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user || !user.validPassword(password)) {
          return done(null, false, { errors: { 'email or password': 'is invalid' } })
        }
        return done(null, user)
      }).catch(done)
  })
)