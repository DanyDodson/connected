// async wrapper
const ash = require('express-async-handler')

// global configs
const config = require('config')
const client = config.get('app.client')

// login functions
const passport = require('passport')


// db schemas
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Artist = mongoose.model('Artist')

// nodemailer responses 
const { sendMail } = require('../helpers/mailer')
const { verify, verified } = require('../helpers/mailer')
const { forgot, reset } = require('../helpers/mailer')

/** 
 * @desc register new user
 * @route POST /api/signup
 * @auth public
*/

exports.signup = ash(async (req, res, next) => {
    const user = new User(req.body)
    await user.setPassword(req.body.password)
    await user.save()
    return res.status(201).json({ user: user.authJson() })
})

/** 
 * @desc google auth
 * @route GET /api/google/callback
 * @auth public
*/

exports.google = ash(async (req, res, next) => {
    passport.authenticate('google', { scope: ['artist'] })
    return res.status(200).json({ user: user.authJson() })
})

/** 
 * @desc google callback
 * @route GET /api/google/callback
 * @auth public
*/

exports.googleCB = ash(async (req, res, next) => {
    passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' })
    return res.status(200).json({ user: user.authJson() })
})

/** 
 * @desc User signin
 * @route GET /api/signin
 * @auth public
*/

exports.signin = ash(async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(422).json(info)
        user.token = user.jwtForUser()
        return res.status(200).json({ user: user.authJson() })
    })(req, res, next)
})

/** 
 * @desc Get current user from jwt
 * @route GET /api
 * @auth private
*/

exports.user = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    if (!user) return res.status(404).json({ msg: 'user not found' })
    return res.status(200).json({ user: user.authJson() })
})

/** 
 * @desc Checks if user is user or admin
 * @route GET /api
 * @auth public
*/

exports.role = ash(async (req, res, next) => {
    let user = req.payload && req.payload.role === 'user'
    let admin = req.payload && req.payload.role === 'admin'
    const auth = user || admin
    console.log('USER:', user, 'ADMIN:', admin)
    if (!auth) return res.status(403).json({ err: 'user is not authorized to perform this action' })
    next()
})

/** 
 * @desc Create & mail verify email token
 * @route PUT /api/verify/send
 * @auth Private
*/

exports.verify = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    if (user.verified) return res.status(404).json({ msg: 'your account has already been verified' })
    const token = user.jwtForVerify(user._id)
    await user.updateOne({ vToken: token })
    await sendMail(verify(user.email, client, token))
    return res.status(200).json({ msg: `Email has been sent to ${user.email}. Follow the instructions to verify your account.`, token: token, })
})

/** 
 * @desc Verify token & continue to create artist
 * @route PUT /api/verify/return
 * @auth Private
*/

exports.verified = ash(async (req, res, next) => {
    const { token } = req.body
    const user = await User.findOne({ vToken: token })
    if (!user) return res.status(401).json({ err: 'invalid link' })
    user.verified = true
    user.vToken = null
    user.updated = Date.now()
    let up = await user.save()
    if (!up) return res.status(400).json({ err: err })
    await sendMail(verified(user.email, client))
    next()
})

/** 
 * @desc Create & mail password reset token
 * @route PUT /api/forgot/send
 * @auth Private
*/

exports.forgot = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    if (!user) return res.status(404).json({ msg: 'user not found' })
    const token = user.jwtForReset(user.id)
    await user.updateOne({ 'rToken': token })
    await sendMail(forgot(user.email, client, token))
    return res.status(200).json({ msg: `An email has been sent to ${user.email}. Follow the instructions to reset your password.`, token: token, })
})

/** 
 * @desc Verify token and set new password
 * @route PUT /api/forgot/return
 * @auth Private
*/

exports.reset = ash(async (req, res, next) => {
    const { token, newPassword } = req.body
    const user = await User.findOne({ rToken: token })
    if (!user) return res.status(401).json({ err: 'invalid link' })
    await user.setPassword(newPassword)
    user.rToken = null
    user.updated = Date.now()
    let up = await user.save()
    if (!up) return res.status(400).json({ err: err })
    await sendMail(reset(user.email, client))
    return res.status(200).json({ msg: 'great! Now you can login with your new password.' })
})

/** 
 * @desc Clears users jwt cookie
 * @route GET /api/signout
 * @auth Private
*/

exports.signout = ash(async (req, res, next) => {
    return res.status(200).json({ msg: 'signout route working' })
})

/**
 * @desc Deletes one user
 * @route DELETE /api/delete
 * @auth Private
*/

exports.destroy = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    if (!user) return res.status(404).json({ msg: 'user not found' })
    await Artist.findOneAndRemove({ user: user._id })
    await User.findOneAndRemove({ _id: user._id })
    return res.status(204).json({ msg: 'success: user was removed' })
})