const { check, sanitizeBody } = require('express-validator')

const User = require('../../models/User')
const Profile = require('../../models/Profile')

exports.validateFavorite = [
  check('favorites.favorited')
    .custom((value, { req }) => {
      return Profile.find({ user: req.payload.id }, { $in: { 'favorites.favorited': req.post.id } }).then(profile => {
        if (profile) { return Promise.reject('already favorited') }
        return true
      })
    }),
  sanitizeBody('notifyOnReply').toBoolean()
]
