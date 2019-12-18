import { check, sanitizeBody } from 'express-validator'

export default [
    check('email')
        .trim()
        .escape()
        .unescape()
        .isString()
        .isEmail().withMessage('a valid email is required')
        .normalizeEmail()
        .exists({ checkFalsy: true, checkNull: true }).withMessage('username is required'),
    check('password')
        .trim()
        .escape()
        .unescape()
        .isString()
        .exists({ checkFalsy: true, checkNull: true }).withMessage('password is required'),
    sanitizeBody('notifyOnReply').toBoolean()
]