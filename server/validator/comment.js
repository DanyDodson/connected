const { param, query, cookies, header, body, check } = require('express-validator')
const { sanitizeBody } = require('express-validator')

exports.checkComment = [
    check('content')
        .trim()
        .escape()
        .unescape()
        .exists().withMessage('content is required')
    ,
    sanitizeBody('notifyOnReply').toBoolean()
]