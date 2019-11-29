const passport = require('passport')
const jwt = require('express-jwt')
const config = require('config')
const secret = config.get('app.secret')

// const local = require('./local')
// const google = require('./google')

function getTokenFromHeader(req) {
    if (
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
        req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        return req.headers.authorization.split(' ')[1]
    }
    return null
}

var auth = {
    req: jwt({ secret: secret, userProperty: 'payload', getToken: getTokenFromHeader }),
    opt: jwt({ secret: secret, userProperty: 'payload', credentialsRequired: false, getToken: getTokenFromHeader })
}

// passport.serializeUser((user, done) => {
//     console.log('=== serialize ... called ===')
//     console.log(user) // the whole raw user object!
//     console.log('---------')
//     done(null, { _id: user._id })
// })

// passport.deserializeUser((id, done) => {
//     console.log('DEserialize ... called')
//     User.findOne(
//         { _id: id },
//         'firstName lastName photos local.username',
//         (err, user) => {
//             console.log('======= DESERILAIZE USER CALLED ======')
//             console.log(user)
//             console.log('--------------')
//             done(null, user)
//         }
//     )
// })

// passport.use(LocalStrategy)
// passport.use(GoogleStratgey)

module.exports = auth
