const { param, query, cookies, header, body, check } = require('express-validator')
const { sanitizeBody } = require('express-validator')
const mongoose = require('mongoose')
const User = mongoose.model('User')

exports.checkSignup = [
    check('email')
        .trim()
        .escape()
        .unescape()
        .isString()
        .isEmail().withMessage('a valid email is required')
        .normalizeEmail()
        .custom((value, { req }) => { return User.findOne({ email: req.body.email }).then(user => { if (user) { return Promise.reject('email already in use') } }) }),
    check('password')
        .trim()
        .escape()
        .unescape()
        .exists({ checkFalsy: true, checkNull: true }).withMessage('password is required')
        .matches(/(?=.*[0-9])/).withMessage('password requires at least one number')
        .matches(/(?=.*[A-Za-z])/).withMessage('password requires at least one letter')
        .matches(/(?=.*[@$.!%*#?&])/).withMessage('password requires at least one special character')
        .isLength({ min: 8 }).withMessage('Password requires a minimum eight characters'),
    check('password2')
        .trim()
        .escape()
        .unescape()
        .exists({ checkFalsy: true, checkNull: true }).withMessage('confirm password required')
        .if(check('password').exists({ checkFalsy: false, checkNull: false })).custom((value, { req }) => value === req.body.password).withMessage('passwords dont match'),
    sanitizeBody('notifyOnReply').toBoolean()
]