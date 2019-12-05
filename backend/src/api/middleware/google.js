import GoogleStrategy from 'passport-google-oauth'
import logger from '../../loaders/logger'
import User from '../../models/User'

const strategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  function (token, tokenSecret, artist, done) {
    // testing
    logger.warn('===== GOOGLE PROFILE =======')
    logger.warn(artist)
    logger.warn('======== END ===========')
    // code
    const { id, name, photos } = artist
    User.findOne({ 'google.googleId': id }, (err, userMatch) => {
      // handle errors here:
      if (err) {
        logger.err('Error!! trying to find user with googleId')
        logger.err(err)
        return done(null, false)
      }
      // if there is already someone with that googleId
      if (userMatch) {
        return done(null, userMatch)
      } else {
        // if no user in our db, create a new user with that googleId
        logger.warn('====== PRE SAVE =======')
        logger.warn(id)
        logger.warn(artist)
        logger.warn('====== post save ....')
        const newGoogleUser = new User({
          'google.googleId': id,
          firstName: name.givenName,
          lastName: name.familyName,
          photos: photos
        })
        // save this user
        newGoogleUser.save((err, savedUser) => {
          if (err) {
            logger.err('Error!! saving the new google user')
            logger.err(err)
            return done(null, false)
          } else {
            return done(null, savedUser)
          }
        }) // closes newGoogleUser.save
      }
    }) // closes User.findONe
  }
)

module.exports = strategy
