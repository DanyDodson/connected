const {
  testingCtrl,
  signUpCtrl,
  signInCtrl,
  getUserCtrl,
  setVerifiedCtrl,
  forgotPassCtrl,
  resetPassCtrl,
  signOutCtrl,
  destroyCtrl,
} = require('../controllers/auth')

const {
  validateSignUp,
  validateSignIn,
  validateIsVerified,
  validateReset,
  validateResults,
} = require('../validation')

const auth = require('../middleware/auth')
const router = require('express').Router()
const asyncHandler = require('express-async-handler')

router.get('/testing', testingCtrl)
router.post('/signup', validateSignUp, validateResults, asyncHandler(signUpCtrl))
router.post('/signin', validateSignIn, validateResults, asyncHandler(signInCtrl))

router.get('/details', auth.required, asyncHandler(getUserCtrl))

router.put('/verify-email', auth.required, validateIsVerified, validateResults, asyncHandler(setVerifiedCtrl))
router.put('/forgot-password', auth.required, asyncHandler(forgotPassCtrl))
router.put('/reset-password', auth.required, validateReset, validateResults, asyncHandler(resetPassCtrl))

router.get('/signout', auth.required, asyncHandler(signOutCtrl))
router.delete('/destroy', auth.required, asyncHandler(destroyCtrl))

module.exports = router