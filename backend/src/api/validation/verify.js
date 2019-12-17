const { check } = require('express-validator')

const User = require('../../models/User')

exports.validateIsVerified = [
  check('req').custom((value, { req }) => { if (req.payload.verified === true || req.payload.verifyToken === {}) { throw new Error('your accounts already been verified') } return true }),
]
