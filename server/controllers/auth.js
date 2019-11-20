const config = require('config')
const client = config.get('app.client')
const secret = config.get('app.secret')
const { sendMail } = require('../helpers/mailer')
const ash = require('express-async-handler')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.signup = ash(async (req, res) => {
    const user = new User(req.body)
    await user.setPassword(req.body.password)
    await user.save()
    return res.json({ user: user.toAuthJSON() })
    if (err) return res.status(500).json('Server Error')
})

exports.signin = ash(async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) return next(err)
        if (!user) return res.status(422).json(info)
        user.token = user.generateJWT()
        return res.json({ user: user.toAuthJSON() })
    })(req, res, next)
})

exports.account = ash(async (req, res) => {
    const user = await User.findById(req.payload.id)
    if (!user) return res.status(404).json({ msg: 'user not found' })
    return res.json({ user: user.toAuthJSON() })
})

exports.verify = ash(async (req, res) => {
    const user = await User.findById(req.payload.id).select('email')
    if (!user) return res.status(404).json({ msg: 'user not found' })
    const token = jwt.sign({ id: user._id, iss: "NODEAPI" }, secret)
    const message = {
        from: 'SeeSee ❤️ <noreply@seesee.com>',
        to: user.email,
        subject: 'Verify email instructions',
        text: `Please use the following link to verify this email for your account: ${client}/verified${token}`,
        html: `<p>Please use the following link to verify this email for your account:</p> <p>${client}/verified/${token}</p>`
    }
    await user.updateOne({ verifyToken: token })
    if (!user) return res.status(404).json({ msg: 'user not found' })
    await sendMail(message)
    return res.status(200).json({ msg: `Email has been sent to ${user.email}. Follow the instructions to verify your account.` })
})

exports.verified = ash(async (req, res) => {
    const verifyToken = req.params.verifyToken
    const user = await User.findOne({ verifyToken })
    if (!user) return res.status(401).json({ error: 'invalid link' })
    user.verified = true
    user.verifyToken = ''
    user.updated = Date.now()
    const updated = await user.save()
    if (!updated) return res.status(400).json({ error: err })
    const message = {
        from: 'SeeSee ❤️ <noreply@seesee.com>',
        to: user.email,
        subject: 'Your account has been verified !',
        text: `Welcome to SeeSee! Create your profile: ${client}/profiles/me`,
        html: `<p>Welcome to SeeSee! Create your profile: ${client}/profiles/me`
    }
    await sendMail(message)
    return res.status(200).json({ message: 'Great! Youre accounts been verified. Start browsing or create a profile to post, purchase and sell items.' })
})

exports.recover = ash(async (req, res) => {
    const user = await User.findById(req.payload.id).select('email')
    if (!user) return res.status(404).json({ msg: 'user not found' })
    const token = jwt.sign({ id: user._id, iss: "NODEAPI" }, secret)
    const message = {
        from: 'SeeSee ❤️ <noreply@seesee.com>',
        to: user.email,
        subject: 'Password Reset Instructions',
        text: `Please use the following link to reset your password: ${client}/recovered/${token}`,
        html: `<p>Please use the following link to reset your password: ${client}/recovered/${token}</p>`
    }
    await user.updateOne({ recoveryToken: token })
    if (!user) return res.status(404).json({ msg: 'user not found' })
    await sendMail(message)
    return res.status(200).json({ msg: `Email has been sent to ${user.email}. Follow the instructions to reset your password.` })
})

exports.recovered = ash(async (req, res) => {
    const recoveryToken = req.params.recoveryToken
    const user = await User.findOne({ recoveryToken })
    if (!user) return res.status(401).json({ error: 'Invalid Link!' })
    const newPassword = req.body.newPassword
    await user.setPassword(newPassword)
    user.recoveryToken = ''
    user.updated = Date.now()
    const updated = await user.save()
    if (!updated) return res.status(400).json({ error: err })
    const message = {
        from: 'SeeSee ❤️ <noreply@seesee.com>',
        to: user.email,
        subject: 'Your password has been changed !',
        text: `Your password has been changed ! Signin to with your new password ${client}/signin`,
        html: `<p>Your password has been changed ! Signin to with your new password ${client}/signin</p>`
    }
    await sendMail(message)
    return res.status(200).json({ message: 'Great! Now you can login with your new password.' })
})

exports.signout = ash(async (req, res) => {
    return res.status(200).send('Signout')
})

exports.destroy = ash(async (req, res) => {
    return res.status(200).send('destroy route working')
})