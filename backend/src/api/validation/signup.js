// import mongoose from 'mongoose'

import {
  check,
  sanitizeBody
} from 'express-validator'

import user from '../../models/user'

exports.signupValidator = [
  check('email')
    .trim()
    .escape()
    .unescape()
    .isString()
    .isEmail().withMessage('a valid email is required')
    .normalizeEmail()
    .bail()
    .custom((value, { req }) => { return user.findOne({ email: req.body.email }).then(user => { if (user) { return Promise.reject(new Error('email already in use')) } }) }),
  check('username')
    .trim()
    .escape()
    .unescape()
    .isString()
    .exists({ checkFalsy: true, checkNull: true }).withMessage('username cant be empty')
    .bail()
    .isAlphanumeric().withMessage('username can only contain letters and numbers')
    .isLength({ min: 3, max: 30 }).withMessage('username requires a minimum of 3 characters')
    .custom((value, { req }) => { return user.findOne({ username: req.body.username }).then(user => { if (user) { return Promise.reject(new Error('username already in use')) } }) }),
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
