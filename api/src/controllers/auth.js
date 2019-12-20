import { Container } from 'typedi'
import AuthService from '../services/auth'
import passport from 'passport'

import asyncHandler from 'express-async-handler'

/**
 * @desc auth test route
 * @route GET /api/auth
 * @auth public
*/
export const testingCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const msg = await authServiceInstance.testingService()
  return res.status(201).json(msg)
})

/**
 * @desc register new user
 * @route POST /api/auth/signup
 * @auth public
*/
export const signUpCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const { user, verifyToken } = await authServiceInstance.signUpService(req.body)
  return res.status(201).json(user, verifyToken)
})

/**
 * @desc user signin
 * @route POST /api/auth/signin
 * @auth public
*/
export const signInCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  await authServiceInstance.signInService()
  await passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.status(422).json(info)
    user.token = user.generateJWT()
    return res.status(200).json(user.authJSON())
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
  return res.status(200).json(user.authJSON())
})

/**
 * @desc verify email & continue to create profile
 * @route PUT /api/auth/verify-email
 * @auth private
*/
export const setVerifiedCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const { user } = await authServiceInstance.setVerifiedService(req.payload.verifyToken)
  // return res.status(200).json({ user })
  next()
})

/**
 * @desc create & mail password reset token
 * @route PUT /api/auth/forgot-password
 * @auth private
*/
export const forgotPassCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const { user, resetPassToken } = await authServiceInstance.forgotPassService(req.payload.id)
  return res.status(200).json({ user, resetPassToken })
})

/**
 * @desc verifies resetToken and sets new password
 * @route PUT /api/auth/reset-password
 * @auth private
*/
export const resetPassCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  const { user } = await authServiceInstance.resetPassService(req.body, req.payload.id)
  return res.status(200).json({ user })
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
export const delUserCtrl = asyncHandler(async (req, res, next) => {
  const authServiceInstance = await Container.get(AuthService)
  await authServiceInstance.delUserService(req.payload.id)
  return res.status(204).json({ msg: 'success: user was removed' })
})
