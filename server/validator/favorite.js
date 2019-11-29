const { param, query, cookies, header, body, check } = require('express-validator')
const { sanitizeBody } = require('express-validator')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Profile = mongoose.model('Post')

exports.ckFavo = [
    check('favorites.favorited')
        .custom((value, { req }) => {
            return Profile.find({ user: req.payload.id }, { $in: { 'favorites.favorited': req.post.id } }).then(profile => {
                if (profile) { return Promise.reject('already favorited') }
                return true
            })
        }),
    sanitizeBody('notifyOnReply').toBoolean()
]