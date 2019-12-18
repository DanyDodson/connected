import { check, sanitizeBody } from 'express-validator'

const validateComment = [
    check('content')
        .trim()
        .escape()
        .unescape()
        .exists().withMessage('content is required')
    ,
    sanitizeBody('notifyOnReply').toBoolean()
]

export default validateComment