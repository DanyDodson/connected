const { param, query, cookies, header, body, check } = require('express-validator')
const { sanitizeBody } = require('express-validator')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Artist = mongoose.model('Artist')

exports.ckFavo = [
    check('favorites.favorited')
        .custom((value, { req }) => {
            return Artist.find({ user: req.payload.id }, { $in: { 'favorites.favorited': req.post.id } }).then(artist => {
                if (artist) { return Promise.reject('already favorited') }
                return true
            })
        }),
    sanitizeBody('notifyOnReply').toBoolean()
]