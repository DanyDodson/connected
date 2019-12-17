const asyncHandler = require('express-async-handler')
const passport = require('passport')

const {
  testService,
  signUpService,
  signInService,
  getUserService,
  setVerifiedService,
  forgotPassService,
  resetPassService,
  signOutService,
  destroyUserService,
} = require('../../services/auth')


/**
 * @desc auth test route
 * @route GET /api/auth
 * @auth public
*/
exports.testingCtrl = asyncHandler(async (req, res, next) => {
  const msg = await testService()
  return res.status(201).json({ msg: msg })
})

/**
 * @desc register new user
 * @route POST /api/auth/signup
 * @auth public
*/
exports.signUpCtrl = asyncHandler(async (req, res, next) => {
  const { user, verifyToken, mailerStatus } = await signUpService(req.body)
  return res.status(201).json({ user, verifyToken, mailerStatus })
})

/**
 * @desc user signin
 * @route POST /api/auth/signin
 * @auth public
 */
exports.signInCtrl = asyncHandler(async (req, res, next) => {
  await signInService()
  await passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.status(422).json(info)
    user.token = user.generateJWT()
    return res.status(200).json({ user: user.authJSON() })
  })(req, res, next)
})

/**
 * @desc get jwt payload for user
 * @route GET /api/auth/details
 * @auth private
 */
exports.getUserCtrl = asyncHandler(async (req, res, next) => {
  const user = await getUserService(req.payload.id)
  return res.status(200).json({ user: user.authJSON() })
})

/**
 * @desc verify email & continue to create profile
 * @route PUT /api/auth/verify-email
 * @auth private
 */
exports.setVerifiedCtrl = asyncHandler(async (req, res, next) => {
  const { user, mailerStatus } = await setVerifiedService(req.payload.verifyToken)
  return res.status(200).json({ user, mailerStatus })
})

/**
 * @desc create & mail password reset token
 * @route PUT /api/auth/forgot-password
 * @auth private
 */
exports.forgotPassCtrl = asyncHandler(async (req, res, next) => {
  const { user, mailerStatus } = await forgotPassService(req.payload.id)
  return res.status(200).json({ user, mailerStatus })
})

/**
 * @desc verifies resetToken and sets new password
 * @route PUT /api/auth/reset-password
 * @auth private
 */
exports.resetPassCtrl = asyncHandler(async (req, res, next) => {
  const { user, mailerStatus } = await resetPassService(req.body, req.payload.id)
  return res.status(200).json({ user, mailerStatus })
})

/**
 * @desc removes token
 * @route GET /api/auth/signout
 * @auth private
 */
exports.signOutCtrl = asyncHandler(async (req, res, next) => {
  // res.clearCookie('t')
  return res.status(200).json({ msg: 'signout route working' })
})

/**
 * @desc deletes one user
 * @route DELETE /api/auth/delete
 * @auth private
 */
exports.destroyCtrl = asyncHandler(async (req, res, next) => {
  await destroyUserService(req.payload.id)
  return res.status(204).json({ msg: 'success: user was removed' })
  // return res.status(200).json({ msg: 'destroy route working' })
})

/**
 * @desc checks users roles
 * @route GET /api/auth/roles
 * @auth public
*/
exports.role = asyncHandler(async (req, res, next) => {
  const { user } = await userRolesService(req.payload.role)
})
