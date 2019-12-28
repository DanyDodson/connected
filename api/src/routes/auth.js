import asyncHandler from 'express-async-handler'
import auth from '../middleware/auth'

import {
  testingCtrl,
  signUpCtrl,
  signInCtrl,
  getUserCtrl,
  setVerifiedCtrl,
  forgotPassCtrl,
  resetPassCtrl,
  signOutCtrl,
  delUserCtrl,
} from '../controllers/auth'

import {
  newProfileCtrl,
  delProfileCtrl,
} from '../controllers/profile'

import {
  validateSignUp,
  validateSignIn,
  validateIsVerified,
  validateReset,
  validateResults,
} from '../validation'

import { Router } from 'express'

export default (app, route = Router()) => {
  app.use('/auth', route)

  route
    .get('/testing', testingCtrl)
    .post('/signup', validateSignUp, validateResults, asyncHandler(signUpCtrl))
    .post('/signin', validateSignIn, validateResults, asyncHandler(signInCtrl))
    .get('/details', auth.required, asyncHandler(getUserCtrl))
    .put('/verify-email', auth.required, validateIsVerified, validateResults, asyncHandler(setVerifiedCtrl), asyncHandler(newProfileCtrl))
    .put('/forgot-password', auth.required, asyncHandler(forgotPassCtrl))
    .put('/reset-password', auth.required, validateReset, validateResults, asyncHandler(resetPassCtrl))
    .get('/signout', auth.required, asyncHandler(signOutCtrl))
    .delete('/destroy', auth.required, asyncHandler(delProfileCtrl), asyncHandler(delUserCtrl))
}