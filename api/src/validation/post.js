import { param, check, sanitizeBody } from 'express-validator'
import User from '../models/User'
import Post from '../models/Post'

export default [
    param(':post_slug')
        .if(check('post_slug').exists({ checkFalsy: false, checkNull: false })).custom((value, { req }) => { return Post.findOne({ user: req.payload.id }).then(post => { if (!post || post.user.toString() !== req.payload.id.toString()) { return Promise.reject('user not authenticated') } }) })
        .if(check('post_slug').exists({ checkFalsy: false, checkNull: false })).custom((value, { req }) => { return Post.findOne({ 'links.slug': req.params.post_slug }).then(post => { if (!post) { return Promise.reject('post slug doesnt exist') } }) }),
    check('details.mediums')
        .trim()
        .escape()
        .unescape()
        .exists().withMessage('medium is required'),
    check('details.title')
        .trim()
        .escape()
        .unescape()
        .isLength({ min: 0, max: 20 }).withMessage('maxium of 20 characters')
        .exists().withMessage('title is required'),
    check('details.description')
        .trim()
        .escape()
        .unescape()
        .isLength({ min: 0, max: 256 }).withMessage('maxium of 256 characters')
        .exists().withMessage('description is required'),
    check('options.critique')
        .toBoolean()
        .exists().withMessage('critique value is required'),
    check('options.shareable')
        .toBoolean()
        .exists().withMessage('shareable value is required'),
    check('options.purchasable')
        .toBoolean()
        .exists().withMessage('purchasable value is required'),
    check('details.price')
        .if(check('options.purchasable').custom((value, { req }) => value === true)).exists().withMessage('price value is required')
        .trim()
        .escape()
        .unescape()
        .toFloat(),
    check('details.tags')
        .trim()
        .escape()
        .unescape(),
    sanitizeBody('notifyOnReply').toBoolean()
]
