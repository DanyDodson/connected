import { Container } from 'typedi'
import asyncHandler from 'express-async-handler'
import AuthService from '../services/auth'
import passport from 'passport'
import logger from '../loaders/logger'
/**
 * @desc auth test route
 * @route GET /api/auth
 * @auth public
*/
export const testingCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const msg = await authServiceInstance.testService()
  return res.status(201).json({ msg: msg })
})

/**
 * @desc register new user
 * @route POST /api/auth/signup
 * @auth public
*/
export const signUpCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const { user, verifyToken } = await authServiceInstance.signUpService(req.body)
  return res.status(201).json({ user, verifyToken })
})

/**
 * @desc user signin
 * @route POST /api/auth/signin
 * @auth public
 */
export const signInCtrl = asyncHandler(async (req, res, next) => {
  // await AuthService.signInService()
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
export const getUserCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const { user } = await authServiceInstance.getUserService(req.payload.id)
  return res.status(200).json({ user: user.authJSON() })
})

/**
 * @desc verify email & continue to create profile
 * @route PUT /api/auth/verify-email
 * @auth private
 */
export const setVerifiedCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const { user, mailerStatus } = await authServiceInstance.setVerifiedService(req.payload.verifyToken)
  return res.status(200).json({ user, mailerStatus })
})

/**
 * @desc create & mail password reset token
 * @route PUT /api/auth/forgot-password
 * @auth private
 */
export const forgotPassCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const { user, resetPassToken, mailerStatus } = await authServiceInstance.forgotPassService(req.payload.id)
  return res.status(200).json({ user, resetPassToken, mailerStatus })
})

/**
 * @desc verifies resetToken and sets new password
 * @route PUT /api/auth/reset-password
 * @auth private
 */
export const resetPassCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const { user, mailerStatus } = await authServiceInstance.resetPassService(req.body, req.payload.id)
  return res.status(200).json({ user, mailerStatus })
})

/**
 * @desc removes token
 * The reason for a logout route could be deleting a 'push notification token'
 * so the device stops receiving push notifications after logout.
 * @route GET /api/auth/signout
 * @auth private
*/
export const signOutCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  // const { headrs } = await authServiceInstance.signOutService(req.headers['authorization'])
  const headrs = req.headers['authorization']
  return res.status(200).json({ headrs })
})

/**
 * @desc deletes one user
 * @route DELETE /api/auth/delete
 * @auth private
 */
export const destroyCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  await authServiceInstance.destroyUserService(req.payload.id)
  return res.status(204).json({ msg: 'success: user was removed' })
})

/**
 * @desc checks users roles
 * @route GET /api/auth/roles
 * @auth public
*/
export const role = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const { user } = await authServiceInstance.userRolesService(req.payload.role)
})
