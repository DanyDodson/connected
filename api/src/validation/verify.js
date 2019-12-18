import { check } from 'express-validator'

const validateIsVerified = [
  check('req').custom((value, { req }) => { if (req.payload.verified === true || req.payload.verifyToken === {}) { throw new Error('your accounts already been verified') } return true }),
]

export default validateIsVerified
