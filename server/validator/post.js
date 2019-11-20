const { param, query, cookies, header, body, check } = require('express-validator')
const { sanitizeBody } = require('express-validator')

exports.checkPost = [
    check('medium')
        .trim()
        .escape()
        .unescape()
    // .exists().withMessage('medium is required')
    ,
    check('title')
        .trim()
        .escape()
        .unescape()
    // .isLength({ min: 0, max: 20 }).withMessage('maxium of 20 characters')
    // .exists().withMessage('title is required')
    ,
    // check('description')
    //   // .isLength({ min: 0, max: 256 }).withMessage('maxium of 256 characters')
    //   .exists().withMessage('description is required'),
    // check('critique')
    //   .toBoolean(),
    // check('shareable')
    //   .toBoolean(),
    // check('purchasable')
    //   .toBoolean(),
    // check('price')
    //   .trim()
    //   .escape()
    //   .unescape()
    //   .toFloat(),
    // check('tags')
    //   .trim()
    //   .escape()
    //   .unescape(),
    sanitizeBody('notifyOnReply').toBoolean()
]