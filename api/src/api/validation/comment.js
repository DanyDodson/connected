const { check, sanitizeBody } = require('express-validator')

exports.validateComment = [
    check('content')
        .trim()
        .escape()
        .unescape()
        .exists().withMessage('content is required')
    ,
    sanitizeBody('notifyOnReply').toBoolean()
]
