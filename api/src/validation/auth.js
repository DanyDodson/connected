import { check } from 'express-validator'

const validateAuth = [
    check('req').custom((value, { req }) => { if (req.payload.id === true) { throw new Error('your accounts already been vefrified') } return true }),
]

export default validateAuth