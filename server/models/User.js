const mongoose = require('mongoose')
// import mongooseStringQuery from 'mongoose-string-query'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    // lowercase: true,
    // trim: true,
    // index: true,
    // unique: true,
    // required: true,
  },
  username: {
    type: String,
    // lowercase: true,
    // trim: true,
    // index: true,
    // unique: true,
    // required: true,
  },
  password: {
    type: String,
    // required: true
  },
  avatar: {
    type: String
  },
  // preferences: {
  //   notifications: {
  //     daily: {
  //       type: Boolean,
  //       default: false,
  //     },
  //     weekly: {
  //       type: Boolean,
  //       default: true,
  //     },
  //     follows: {
  //       type: Boolean,
  //       default: true,
  //     },
  //   },
  // },
  // recoveryCode: {
  //   type: String,
  //   trim: true,
  //   default: '',
  // },
  // active: {
  //   type: Boolean,
  //   default: true,
  // },
  // admin: {
  //   type: Boolean,
  //   default: false,
  // },
  favorites: [{
    type: Schema.Types.ObjectId, ref: 'posts'
  }],
  following: [{
    type: Schema.Types.ObjectId, ref: 'users'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// enables query capabilities (e.g. ?foo=bar)
// UserSchema.plugin(mongooseStringQuery)

// pre-save hook that sends welcome email via custom email utility
// UserSchema.pre('save', function (next) {
//   if (!this.isNew) {
//     next()
//   }

//   email({
//     type: 'welcome',
//     email: this.email,
//   })
//     .then(() => {
//       next()
//     })
//     .catch(err => {
//       logger.error(err)
//       next()
//     })
// })

// pre-save hook that sends password recovery email via custom email utility
// UserSchema.pre('findOneAndUpdate', function (next) {
//   if (!this._update.recoveryCode) {
//     return next()
//   }

//   email({
//     type: 'password',
//     email: this._conditions.email,
//     passcode: this._update.recoveryCode,
//   })
//     .then(() => {
//       next()
//     })
//     .catch(err => {
//       logger.error(err)
//       next()
//     })
// })

UserSchema.methods.favorite = function (id) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites.push(id)
  }

  return this.save()
}

UserSchema.methods.unfavorite = function (id) {
  this.favorites.remove(id)
  return this.save()
}

UserSchema.methods.isFavorite = function (id) {
  return this.favorites.some(function (favoriteId) {
    return favoriteId.toString() === id.toString()
  })
}

UserSchema.methods.follow = function (id) {
  if (this.following.indexOf(id) === -1) {
    this.following.push(id)
  }

  return this.save()
}

UserSchema.methods.unfollow = function (id) {
  this.following.remove(id)
  return this.save()
}

UserSchema.methods.isFollowing = function (id) {
  return this.following.some(function (followId) {
    return followId.toString() === id.toString()
  })
}

module.exports = User = mongoose.model('user', UserSchema)
