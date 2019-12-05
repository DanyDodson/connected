import passport from 'passport'
import User from 'User'

const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password', },
  function (email, password, done) {
    User.findOne({ email: email })
      .then(function (user) {
        if (!user || !user.validPassword(password)) {
          return done(null, false, { errors: { 'email or password': 'is invalid' } })
        }
        return done(null, user)
      }).catch(done)
  }
))
