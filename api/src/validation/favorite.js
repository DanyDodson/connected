import { check, sanitizeBody } from 'express-validator'
import Profile from '../models/Profile'
import User from '../models/User'

export default [
  check('favorites.favorited')
    .custom((value, { req }) => {
      return Profile.find({ user: req.payload.id }, { $in: { 'favorites.favorited': req.post.id } }).then(profile => {
        if (profile) { return Promise.reject('already favorited') }
        return true
      })
    }),
  sanitizeBody('notifyOnReply').toBoolean()
]
