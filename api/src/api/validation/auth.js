const { check } = require('express-validator')

const User = require('../../models/User')

exports.validateAuth = [
    check('req').custom((value, { req }) => { if (req.payload.id === true) { throw new Error('your accounts already been vefrified') } return true }),
]
