import mongoose from 'mongoose'

import {
  check,
  sanitizeBody
} from 'express-validator'

const Artist = mongoose.model('../../models/artist.js')

exports.ckFavo = [
  check('favorites.favorited')
    .custom((value, { req }) => {
      return Artist.find({ user: req.payload.id }, { $in: { 'favorites.favorited': req.post.id } }).then(artist => {
        if (artist) { return Promise.reject(new Error('already favorited')) }
        return true
      })
    }),
  sanitizeBody('notifyOnReply').toBoolean()
]
