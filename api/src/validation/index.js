import validateSignUp from './signup'
import validateSignIn from './signin'
import validateAuth from './auth'
import validateReset from './reset'
import validateIsVerified from './verify'
import validateProfile from './profile'
import validatePost from './post'
import validateComment from './comment'
import validateFavorite from './favorite'

import { validationResult } from 'express-validator'

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
    validateProfile,
    validatePost,
    validateComment,
    validateFavorite,
    validateResults,
}
