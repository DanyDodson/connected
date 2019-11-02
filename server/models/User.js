const mongoose = require('mongoose')
const config = require('config')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const image = config.get('userImage')
const secret = config.get('secret')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  username: { type: String, lowercase: true, trim: true, index: true, unique: true, required: true, },
  email: { type: String, lowercase: true, trim: true, index: true, unique: true, required: true, },
  password: { type: String, required: true },
  image: { type: String, default: image, },
  active: { type: Boolean, default: true, },
  type: { type: String, default: 'regular' },
  avatar: { type: String, },
  recover: { type: String, trim: true, default: '', },
  joined: { type: Date, default: Date.now },
  counts: {
    following: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'posts' }],
  },
  preferences: {
    notifications: {
      daily: { type: Boolean, default: false, },
      weekly: { type: Boolean, default: true, },
      follows: { type: Boolean, default: true, },
    },
  },
  following: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'users' }],
})

UserSchema.methods.validPassword = function (password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.generateJWT = function () {
  let today = new Date()
  let exp = new Date(today)

  exp.setDate(today.getDate() + 60)
  return jwt.sign({
    id: this._id, username: this.username, image: this.image, exp: parseInt(exp.getTime() / 1000),
  }, secret)
}

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image,
  }
}

UserSchema.methods.toProfileJSONFor = function (user) {
  return {
    username: this.username,
    image: this.image,
    following: user ? user.isFollowing(this._id) : false,
  }
}

UserSchema.methods.favorite = function (id) {
  if (this.counts.favorites.indexOf(id) === -1) {
    this.counts.favorites.push(id)
  }

  return this.save()
}

UserSchema.methods.unfavorite = function (id) {
  this.counts.favorites.remove(id)
  return this.save()
}

UserSchema.methods.isFavorite = function (id) {
  return this.counts.favorites.some(function (favoriteId) {
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