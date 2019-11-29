const ash = require('express-async-handler')
const config = require('config')
const client = config.get('app.client')
const { sendMail, verify, verified, forgot, reset } = require('../helpers/mailer')
const { expMins } = require('../helpers/exp')
const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Profile = mongoose.model('Profile')

// let i - i = i ? i < 0 ? Math.max(0, len + i) : i : 0

exports.signup = ash(async (req, res, next) => {
    const user = new User(req.body)
    await user.setPassword(req.body.password)
    await user.save()
    return res.status(201).json({ user: user.authJson() })
})

exports.google = ash(async (req, res, next) => {
    passport.authenticate('google', { scope: ['profile'] })
    return res.status(200).json({ user: user.authJson() })
})

exports.googleCb = ash(async (req, res, next) => {
    passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' })
    return res.status(200).json({ user: user.authJson() })
})

exports.signin = ash(async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(422).json(info)
        user.token = user.jwtForUser()
        return res.status(200).json({ user: user.authJson() })
    })(req, res, next)
})

exports.user = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    if (!user) return res.status(404).json({ msg: 'user not found' })
    return res.status(200).json({ user: user.authJson() })
})

exports.role = ash(async (req, res, next) => {
    let user = req.payload && req.payload.role === 'user'
    let admin = req.payload && req.payload.role === 'admin'
    const auth = user || admin
    console.log('USER:', user, 'ADMIN:', admin)
    if (!auth) return res.status(403).json({ err: 'user is not authorized to perform this action' })
    next()
})

exports.verify = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    if (user.verified) return res.status(404).json({ msg: 'your account has already been verified' })
    const token = user.jwtForVerify(user._id)
    await user.updateOne({ vToken: token })
    await sendMail(verify(user.email, client, token))
    return res.status(200).json({ msg: `Email has been sent to ${user.email}. Follow the instructions to verify your account.`, token: token, })
})

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

exports.forgot = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    if (!user) return res.status(404).json({ msg: 'user not found' })
    const token = user.jwtForReset(user.id)
    await user.updateOne({ 'rToken': token })
    await sendMail(forgot(user.email, client, token))
    return res.status(200).json({ msg: `An email has been sent to ${user.email}. Follow the instructions to reset your password.`, token: token, })
})

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

exports.signout = ash(async (req, res, next) => {
    return res.status(200).json({ msg: 'signout route working' })
})

exports.destroy = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    if (!user) return res.status(404).json({ msg: 'user not found' })
    await Profile.findOneAndRemove({ user: user._id })
    await User.findOneAndRemove({ _id: user._id })
    return res.status(204).json({ msg: 'success: user was removed' })
})