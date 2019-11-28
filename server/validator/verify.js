const { param, query, cookies, header, body, check } = require('express-validator')
const { sanitizeBody } = require('express-validator')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.ckVerify = [
    check('req').custom((value, { req }) => { if (req.payload.verified === true) { throw new Error('your accounts already been vefrified') } return true }),
]