import {
  testingCtrl,
  signUpCtrl,
  signInCtrl,
  getUserCtrl,
  setVerifiedCtrl,
  forgotPassCtrl,
  resetPassCtrl,
  signOutCtrl,
  destroyCtrl,
} from '../controllers/auth'

import {
  newProfileCtrl,
} from '../controllers/profile'

import {
  validateSignUp,
  validateSignIn,
  validateIsVerified,
  validateReset,
  validateResults,
} from '../validation'

import { Router } from 'express'
import auth from '../middleware/auth'
import asyncHandler from 'express-async-handler'

export default (app, route = Router()) => {

  app.use('/auth', route)

  route.get('/testing', testingCtrl)
  route.post('/signup', validateSignUp, validateResults, asyncHandler(signUpCtrl))
  route.post('/signin', validateSignIn, validateResults, asyncHandler(signInCtrl))

  route.get('/details', auth.required, asyncHandler(getUserCtrl))

  route.put('/verify-email', auth.required, validateIsVerified, validateResults, asyncHandler(setVerifiedCtrl), asyncHandler(newProfileCtrl))
  route.put('/forgot-password', auth.required, asyncHandler(forgotPassCtrl))
  route.put('/reset-password', auth.required, validateReset, validateResults, asyncHandler(resetPassCtrl))

  route.get('/signout', auth.required, asyncHandler(signOutCtrl))
  route.delete('/destroy', auth.required, asyncHandler(destroyCtrl))

}