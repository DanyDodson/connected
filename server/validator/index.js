const { validationResult } = require('express-validator')
const { ckSignup } = require('./signup')
const { ckSignin } = require('./signin')
const { ckVerify } = require('./verify')
const { ckReset } = require('./reset')
const { ckProfile } = require('./profile')
const { ckPost } = require('./post')
const { ckComment } = require('./comment')

let ckResults = (req, res, next) => {
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
    ckSignup,
    ckSignin,
    ckReset,
    ckVerify,
    ckProfile,
    ckPost,
    ckComment,
    ckResults,
}