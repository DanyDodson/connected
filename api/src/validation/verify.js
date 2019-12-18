import { check } from 'express-validator'

export default [
  check('req').custom((value, { req }) => { if (req.payload.verified === true || req.payload.verifyToken === {}) { throw new Error('your accounts already been verified') } return true }),
]
