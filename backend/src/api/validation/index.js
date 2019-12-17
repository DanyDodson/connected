const { validationResult } = require('express-validator')
const { validateSignUp } = require('./signup')
const { validateSignIn } = require('./signin')
const { validateAuth } = require('./auth')
const { validateReset } = require('./reset')
const { validateIsVerified } = require('./verify')
// const { validateProfile } = require('./profile')
// const { validatePost } = require('./post')
// const { validateComment } = require('./comment')
// const { validateFavorite } = require('./favorite')

let validateResults = (req, res, next) => {
    // const format = ({ location, param, msg }) => `${location} [${param}]: ${msg}`
    const format = ({ location, param, msg }) => `${msg}`
    const results = validationResult(req).formatWith(format)
    if (!results.isEmpty()) {
        return res.status(422).json({
            errors: results.array({ onlyFirstError: true })
        })
    }
    next()
}

module.exports = {
    validateSignUp,
    validateSignIn,
    validateAuth,
    validateReset,
    validateIsVerified,
    // ckvalidateProfile,
    // ckvalidatePost,
    // ckvalidateComment,
    // ckvalidateFavorite,
    validateResults,
}
