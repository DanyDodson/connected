import { check } from 'express-validator'

const checkAccountVerification = [
  check('req').custom((value, { req }) => { if (req.payload.verified === true) { throw new Error('your accounts already been vefrified') } return true }),
]

export default checkAccountVerification
