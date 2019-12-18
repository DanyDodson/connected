import { check, sanitizeBody } from 'express-validator'

export default [
    check('content')
        .trim()
        .escape()
        .unescape()
        .exists().withMessage('content is required')
    ,
    sanitizeBody('notifyOnReply').toBoolean()
]