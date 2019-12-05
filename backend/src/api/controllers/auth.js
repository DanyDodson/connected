// // cleans up async
// import ash from 'express-async-handler'
// import log from '../logs/log'

// // global configs
// import config from 'config'
// import client from 'app.client'

// // login functions
// import passport from 'passport'

// // db schemas
// import mongoose 'mongoose'
// import User from 'User'
// import Artist from 'Artist'

// // nodemailer responses
// import { sendMail } from '../helpers/mailer'
// import { verify, verified } from '../helpers/mailer'
// import { forgot, reset } from '../helpers/mailer'

// /**
//  * @desc register new user
//  * @route POST /api/auth/signup
//  * @auth public
// */

// exports.signup = ash(async (req, res, next) => {
//     const user = new User(req.body)
//     await user.setPassword(req.body.password)
//     await user.save()
//     return res.status(201).json({ user: user.authJson() })
// })

// /**
//  * @desc google auth
//  * @route GET /api/auth/google/callback
//  * @auth public
// */

// exports.google = ash(async (req, res, next) => {
//     passport.authenticate('google', { scope: ['artist'] })
//     return res.status(200).json({ user: user.authJson() })
// })

// /**
//  * @desc google callback
//  * @route GET /api/auth/google/callback
//  * @auth public
// */

// exports.googleCB = ash(async (req, res, next) => {
//     passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' })
//     return res.status(200).json({ user: user.authJson() })
// })

// /**
//  * @desc user signin
//  * @route GET /api/auth/signin
//  * @auth public
// */

// exports.signin = ash(async (req, res, next) => {
//     passport.authenticate('local', { session: false }, (err, user, info) => {
//         if (err) return next(err)
//         if (!user) return res.status(422).json(info)
//         user.token = user.jwtForUser()
//         return res.status(200).json({ user: user.authJson() })
//     })(req, res, next)
// })

// /**
//  * @desc check if user is logged in
//  * @auth public
// */

// exports.isAuth = ash(async (req, res, next) => {
//     const user = req.payload
//     if (!user) return res.status(401).json({ msg: 'you must be logged in to do that' })
//     return user.exp > Date.now() / 1000
// })

// /**
//  * @desc get user from jwt
//  * @route GET /api/auth/details
//  * @auth private
// */

// exports.user = ash(async (req, res, next) => {
//     const user = await User.findOne({ _id: req.payload.id })
//     if (!user) return res.status(404).json({ msg: 'user not found' })
//     return res.status(200).json({ user: user.authJson() })
// })

// /**
//  * @desc checks users roles
//  * @route GET /api/auth/roles
//  * @auth public
// */

// exports.role = ash(async (req, res, next) => {
//     let user = req.payload && req.payload.role === 'user'
//     let admin = req.payload && req.payload.role === 'admin'
//     const auth = user || admin
//     log.data('USER:', user, 'ADMIN:', admin)
//     if (!auth) return res.status(403).json({ err: 'user is not authorized to perform this action' })
//     next()
// })

// /**
//  * @desc create & mails verify email token
//  * @route PUT /api/auth/verify/send
//  * @auth private
// */

// exports.verify = ash(async (req, res, next) => {
//     const user = await User.findOne({ _id: req.payload.id })
//     if (user.verified) return res.status(404).json({ msg: 'your account has already been verified' })
//     const token = user.jwtForVerify(user._id)
//     await user.updateOne({ vToken: token })
//     await sendMail(verify(user.email, client, token))
//     return res.status(200).json({ msg: `Email has been sent to ${user.email}. Follow the instructions to verify your account.`, token: token, })
// })

// /**
//  * @desc verify token & continue to create artist
//  * @route PUT /api/auth/verify/return
//  * @auth private
// */

// exports.verified = ash(async (req, res, next) => {
//     const { token } = req.body
//     const user = await User.findOne({ vToken: token })
//     if (!user) return res.status(401).json({ err: 'invalid link' })
//     user.verified = true
//     user.vToken = null
//     user.updated = Date.now()
//     let up = await user.save()
//     if (!up) return res.status(400).json({ err: err })
//     await sendMail(verified(user.email, client))
//     next()
// })

// /**
//  * @desc create & mail password reset token
//  * @route PUT /api/auth/forgot/send
//  * @auth private
// */

// exports.forgot = ash(async (req, res, next) => {
//     const user = await User.findOne({ _id: req.payload.id })
//     if (!user) return res.status(404).json({ msg: 'user not found' })
//     const token = user.jwtForReset(user.id)
//     await user.updateOne({ 'rToken': token })
//     await sendMail(forgot(user.email, client, token))
//     return res.status(200).json({ msg: `An email has been sent to ${user.email}. Follow the instructions to reset your password.`, token: token, })
// })

// /**
//  * @desc verify token and set new password
//  * @route PUT /api/auth/forgot/return
//  * @auth private
// */

// exports.reset = ash(async (req, res, next) => {
//     const { token, newPassword } = req.body
//     const user = await User.findOne({ rToken: token })
//     if (!user) return res.status(401).json({ err: 'invalid link' })
//     await user.setPassword(newPassword)
//     user.rToken = null
//     user.updated = Date.now()
//     let up = await user.save()
//     if (!up) return res.status(400).json({ err: err })
//     await sendMail(reset(user.email, client))
//     return res.status(200).json({ msg: 'great! Now you can login with your new password.' })
// })

// /**
//  * @desc removes token
//  * @route GET /api/auth/signout
//  * @auth private
// */

// exports.signout = ash(async (req, res, next) => {
//     return res.status(200).json({ msg: 'signout route working' })
// })

// /**
//  * @desc deletes one user
//  * @route DELETE /api/auth/delete
//  * @auth private
// */

// exports.destroy = ash(async (req, res, next) => {
//     const user = await User.findOne({ _id: req.payload.id })
//     if (!user) return res.status(404).json({ msg: 'user not found' })
//     await Artist.findOneAndRemove({ user: user._id })
//     await User.findOneAndRemove({ _id: user._id })
//     return res.status(204).json({ msg: 'success: user was removed' })
// })
