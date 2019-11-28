const ash = require('express-async-handler')
const config = require('config')
const client = config.get('app.client')
const { sendMail, verify, verified, forgot, reset } = require('../helpers/mailer')
const { expMins } = require('../helpers/exp')
const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Profile = mongoose.model('Profile')

exports.signup = ash(async (req, res, next) => {
    const user = new User(req.body)
    await user.setPassword(req.body.password)
    await user.save()
    return res.status(200).json(user.authJson())
})

exports.signin = ash(async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(422).json(info)
        user.token = user.generateJWT()
        return res.status(200).json(user.authJson())
    })(req, res, next)
})

exports.account = ash(async (req, res, next) => {
    const user = await User.findById(req.payload.id)
    if (!user) return res.status(404).json({ msg: 'user not found' })
    return res.status(200).json(user.authJson())
})

exports.verify = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    if (user.verified) return res.status(404).json({ msg: 'your account has already been verified' })
    const token = expMins(user._id, 'seesee', user.username, user.email)
    await user.updateOne({ verifyToken: token })
    await sendMail(verify(user.email, client, token))
    return res.status(200).json({ msg: `Email has been sent to ${user.email}. Follow the instructions to verify your account.` })
})

exports.verified = ash(async (req, res, next) => {
    const { verifyToken } = req.body
    const user = await User.findOne({ verifyToken })
    if (!user) return res.status(401).json({ err: 'invalid link' })
    user.verified = true
    user.verifyToken = null
    user.updated = Date.now()
    const updated = await user.save()
    if (!updated) return res.status(400).json({ err: err })
    await sendMail(verified(user.email, client))
    next()
})

exports.forgot = ash(async (req, res, next) => {
    const user = await User.findOne({ _id: req.payload.id })
    if (!user) return res.status(404).json({ msg: 'user not found' })
    const token = expMins(user.id, 'seesee', user.username, user.email)
    await user.updateOne({ 'recoveryToken': token })
    await sendMail(forgot(user.email, client, token))
    return res.status(200).json({ msg: `An email has been sent to ${user.email}. Follow the instructions to reset your password.`, })
})

exports.reset = ash(async (req, res, next) => {
    const { recoveryToken, newPassword } = req.body
    const user = await User.findOne({ recoveryToken })
    if (!user) return res.status(401).json({ err: 'invalid link' })
    await user.setPassword(newPassword)
    user.recoveryToken = null
    user.updated = Date.now()
    const updated = await user.save()
    if (!updated) return res.status(400).json({ err: err })
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