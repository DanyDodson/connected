const { param, query, cookies, header, body, check } = require('express-validator')
const { sanitize, sanitizeBody } = require('express-validator')
const mongoose = require('mongoose')
const Profile = mongoose.model('Profile')
const User = mongoose.model('User')

exports.ckProfile = [
    check('profiles')
        .custom((value, { req }) => { return Profile.find().then(profiles => { if (!profiles) { return Promise.reject('no profiles found') } return true }) }),
    param(':username')
        .custom((value, { req }) => { return User.findById(req.payload.id).then(user => { if (!user) { return Promise.reject('you must be logged in') } }) })
        .custom((value, { req }) => { return User.findById(req.payload.id).then(user => { if (user.verified !== true) { return Promise.reject('you must verify your account before modifying your profile') } }) })
        .custom((value, { req }) => { return Profile.findOne({ 'details.username': req.params.username }).then(profile => { if (!profile) { return Promise.reject('profile doesnt exist') } }) }),
    body('username')
        .trim()
        .escape()
        .unescape()
        .isString()
        .exists({ checkFalsy: true, checkNull: true }).withMessage('username cant be empty')
        .bail()
        .isAlphanumeric().withMessage('username can only contain letters and numbers')
        .isLength({ min: 3, max: 30 }).withMessage('username requires a minimum of 3 characters')
        .custom((value, { req }) => { return Profile.findOne({ 'details.username': value }).then(profile => { if (profile && profile.details.username !== req.payload.username) { return Promise.reject('username already in use') } }) }),
    body('details.name')
        .trim()
        .escape()
        .unescape()
        .isLength({ min: 0, max: 25 }).withMessage('maxium of 25 characters'),
    body('details.about')
        .trim()
        .escape()
        .unescape()
        .isLength({ min: 0, max: 25 }).withMessage('maxium of 25 characters'),
    body('socials.*')
        .trim()
        .escape()
        .unescape()
        .matches(/^(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i)
        .withMessage('website must be a valid url'),
    body('vendor.phone')
        .trim()
        .escape()
        .unescape(),
    body('colors.*')
        .trim()
        .escape()
        .unescape(),
    sanitizeBody('notifyOnReply').toBoolean()
]