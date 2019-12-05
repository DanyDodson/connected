import { validationResult } from 'express-validator'
import { signupValidator } from './signup'
import { signinValidator } from './signin'
// const { ckVerify } = require('./verify')
// const { ckReset } = require('./reset')
// const { ckArtist } = require('./artist')
// const { ckPost } = require('./post')
// const { ckComment } = require('./comment')
// const { ckFavo } = require('./favorite')

const resultsValidator = (req, res, next) => {
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

export {
  signupValidator,
  signinValidator,
  // ckReset,
  // ckVerify,
  // ckArtist,
  // ckPost,
  // ckComment,
  // ckFavo,
  resultsValidator,
}
