const { param, query, cookies, header, body, check } = require('express-validator')
const { sanitizeBody } = require('express-validator')

exports.checkRecovery = [
    check('newPassword')
        .trim()
        .escape()
        .unescape()
        .exists({ checkFalsy: true, checkNull: true }).withMessage('password is required')
        .matches(/(?=.*[0-9])/).withMessage('password requires at least one number')
        .matches(/(?=.*[A-Za-z])/).withMessage('password requires at least one letter')
        .matches(/(?=.*[@$.!%*#?&])/).withMessage('password requires at least one special character')
        .isLength({ min: 8 }).withMessage('Password requires a minimum eight characters'),
    check('newPassword2')
        .trim()
        .escape()
        .unescape()
        .exists({ checkFalsy: true, checkNull: true }).withMessage('confirm password required')
        .if(check('newPassword').exists({ checkFalsy: false, checkNull: false })).custom((value, { req }) => value === req.body.newPassword).withMessage('passwords dont match'),
    sanitizeBody('notifyOnReply').toBoolean()
]