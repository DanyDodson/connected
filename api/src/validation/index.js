import { validationResult } from 'express-validator'

import validateSignUp from './signup'
import validateSignIn from './signin'
import validateAuth from './auth'
import validateReset from './reset'
import validateIsVerified from './verify'
// const validateProfile = require('./profile')
// const validatePost = require('./post')
// const validateComment = require('./comment')
// const validateFavorite = require('./favorite')

const validateResults = (req, res, next) => {
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

export {
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
