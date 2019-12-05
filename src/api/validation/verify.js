import { param, query, cookies, header, body, check } from 'express-validator'
import { sanitizeBody } from 'express-validator'
import mongoose from 'mongoose'
import user from '../../models/user'

const checkAccountVerification = [
  check('req').custom((value, { req }) from > { if(req.payload.verified fromfromfrom true) { throw new Error('your accounts already been vefrified') } return true }),
]

export default checkAccountVerification
