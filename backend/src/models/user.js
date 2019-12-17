const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const config = require('../config')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true, index: 1 },
  salt: String,
  hash: String,
  role: {
    type: String,
    default: 'basic',
    enum: ['basic', 'featured', 'admin']
  },
  verifyToken: { data: String },
  resetToken: { data: String },
  verified: { type: Boolean, default: false },
  profile: { type: ObjectId, ref: 'Profile' },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
})

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.validPassword = function(password) {
  let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
  return this.hash === hash
}

/**
*  @named generateJWT - signs jwt with user data
*  @desc {Object} user object containing user data to sign JWT with
*  @sets {Object} json web token for authenticated api requests
*/

UserSchema.methods.generateJWT = function() {
  let today = new Date()
  let exp = new Date(today)
  let iat = new Date(today)
  iat.setHours(today.getHours() + 0)
  exp.setHours(today.getHours() + 2)
  return jwt.sign({
    id: this._id,
    iss: 'SEESEE_API',
    iat: parseInt(iat.getTime() / 1000),
    nbf: parseInt(iat.getTime() / 1000),
    email: this.email,
    username: this.username,
    profile: this.profile,
    verified: this.verified,
    role: this.role,
    verifyToken: this.verifyToken,
    resetToken: this.resetToken,
    exp: parseInt(exp.getTime() / 1000),
  }, config.jwtSecret)
}

/**
 * @call jwtForVerify
 * @desc jwt for email verification
*/

UserSchema.methods.generateVerifyJWT = (id) => {
  let today = new Date()
  let exp = new Date(today)
  exp.setMinutes(today.getMinutes() + 10)
  return jwt.sign({
    jti: id,
    iss: 'seesee_api',
    scope: 'verify email',
    username: this.username,
    getToken: req => { return req.cookies['access_token'] },
    exp: parseInt(exp.getTime() / 1000),
  }, config.jwtSecret)
}

/**
 * @call jwtForReset
 * @desc jwt for resetting password
*/

UserSchema.methods.generateResetJWT = (id) => {
  let today = new Date()
  let exp = new Date(today)
  exp.setMinutes(today.getMinutes() + 10)
  return jwt.sign({
    jti: id,
    iss: 'SEESEE_API',
    scope: 'reset password',
    username: this.username,
    getToken: req => { return req.cookies['access_token'] },
    exp: parseInt(exp.getTime() / 1000),
  }, config.jwtSecret)
}

/**
 *  returns json {} for user signup & signin response
*/

UserSchema.methods.authJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    username: this.username,
    role: this.role,
    profile: this.profile,
    verified: this.verified,
    created: this.created,
    updated: this.updated,
    resetToken: this.resetToken,
    verifyToken: this.verifyToken,
    authToken: this.generateJWT(),
  }
}

module.exports = mongoose.model('User', UserSchema)