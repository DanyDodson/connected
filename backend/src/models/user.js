import mongoose from 'mongoose'
import config from '../config'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const User = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true, index: 1 },
  vToken: { data: String },
  rToken: { data: String },
  role: { type: String, default: 'user' },
  verified: { type: Boolean, default: false },
  salt: String,
  hash: String,
  artist: { type: mongoose.Schema.Types.String, ref: 'artist' },
  created: { type: Date, default: Date.now },
  updated: { type: Date },
})

// User.pre('save', function (next) {
//   next()
// })

// User.methods.validPassword = function (password) {
//   const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
//   return this.hash === hash
// }

// User.methods.setPassword = function (password) {
//   this.salt = crypto.randomBytes(16).toString('hex')
//   this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
// }

// User.methods.jwtForUser = function () {
//   const today = new Date()
//   const exp = new Date(today)
//   const iat = new Date(today)
//   iat.setHours(today.getHours() + 0)
//   exp.setHours(today.getHours() + 2)
//   return jwt.sign({
//     id: this._id,
//     iss: 'SEESEE_API',
//     iat: parseInt(iat.getTime() / 1000),
//     nbf: parseInt(iat.getTime() / 1000),
//     email: this.email,
//     username: this.username,
//     artist: this.artist,
//     verified: this.verified,
//     role: this.role,
//     vToken: this.vToken,
//     rToken: this.rToken,
//     exp: parseInt(exp.getTime() / 1000),
//   }, config.jwtSecret)
// }

// User.methods.jwtForVerify = (id) => {
//   const today = new Date()
//   const exp = new Date(today)
//   exp.setMinutes(today.getMinutes() + 10)
//   return jwt.sign({
//     jti: id,
//     iss: 'SEESEE_API',
//     scope: 'verify email',
//     username: this.username,
//     getToken: req => { return req.cookies.access_token },
//     exp: parseInt(exp.getTime() / 1000),
//   }, config.jwtSecret)
// }

// User.methods.jwtForReset = (id) => {
//   const today = new Date()
//   const exp = new Date(today)
//   exp.setMinutes(today.getMinutes() + 10)
//   return jwt.sign({
//     jti: id,
//     iss: 'SEESEE_API',
//     scope: 'reset password',
//     username: this.username,
//     getToken: req => { return req.cookies.access_token },
//     exp: parseInt(exp.getTime() / 1000),
//   }, config.jwtSecret)
// }

// User.methods.authJson = function () {
//   return {
//     _id: this._id,
//     email: this.email,
//     username: this.username,
//     role: this.role,
//     artist: this.artist,
//     verified: this.verified,
//     created: this.created,
//     updated: this.updated,
//     vToken: this.vToken,
//     rToken: this.rToken,
//     token: this.jwtForUser(),
//   }
// }

// User.index({ email: 1, }, { unique: true, })

export default mongoose.model('User', User)
