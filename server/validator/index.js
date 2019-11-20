const { validationResult } = require('express-validator')
const { checkSignup } = require('./signup')
const { checkSignin } = require('./signin')
const { checkProfile } = require('./profile')
const { checkUpdate } = require('./update')
const { checkPost } = require('./post')
const { checkComment } = require('./comment')
const { checkRecovery } = require('./recover')

let checkResults = (req, res, next) => {
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
    checkSignup,
    checkSignin,
    checkProfile,
    checkUpdate,
    checkPost,
    checkComment,
    checkRecovery,
    checkResults,
}