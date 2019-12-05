const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const log = require('../logs/log')
const mongoose = require('mongoose')
const User = mongoose.model('User')

const strategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
    function (token, tokenSecret, artist, done) {
        // testing
        log.warn('===== GOOGLE PROFILE =======')
        log.warn(artist)
        log.warn('======== END ===========')
        // code
        const { id, name, photos } = artist
        User.findOne({ 'google.googleId': id }, (err, userMatch) => {
            // handle errors here:
            if (err) {
                log.err('Error!! trying to find user with googleId')
                log.err(err)
                return done(null, false)
            }
            // if there is already someone with that googleId
            if (userMatch) {
                return done(null, userMatch)
            } else {
                // if no user in our db, create a new user with that googleId
                log.warn('====== PRE SAVE =======')
                log.warn(id)
                log.warn(artist)
                log.warn('====== post save ....')
                const newGoogleUser = new User({
                    'google.googleId': id,
                    firstName: name.givenName,
                    lastName: name.familyName,
                    photos: photos
                })
                // save this user
                newGoogleUser.save((err, savedUser) => {
                    if (err) {
                        log.err('Error!! saving the new google user')
                        log.err(err)
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