import mongoose from 'mongoose'
import config from '../config'
import logger from '../loaders/logger'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

import {
  setAuthToken,
  setVerifyEmailToken,
  setForgotPasswordToken,
} from '../utilities/tokens'

const UserSchema = new mongoose.Schema({
  salt: String,
  hash: String,
  username: String,
  email: { type: String, unique: true, index: 1 },
  role: { type: String, default: 'basic', enum: ['basic', 'featured', 'admin'] },
  authToken: { data: String },
  resetToken: { type: String },
  verifyToken: { type: String },
  verified: { type: Boolean, default: false },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
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

UserSchema.methods.authUserToken = function() {
  const payload = { id: this.id, role: this.role, email: this.email, username: this.username, verified: this.verified }
  return setAuthToken(payload)
}

UserSchema.methods.verifyEmailToken = function() {
  const payload = { id: this.id, email: this.email, username: this.username }
  return setVerifyEmailToken(payload)
}

UserSchema.methods.forgotPasswordToken = function() {
  const payload = { id: this.id, email: this.email, username: this.username }
  return setForgotPasswordToken(payload)
}

// UserSchema.methods.getUserByUsername = function(username) {
//   let user = this.findOne({ username: username })
//   return user
// }

UserSchema.methods.authUserToJSON = function() {
  logger.debug(this)
  return {
    id: this.id,
    email: this.email,
    username: this.username,
    role: this.role,
    profile: this.profile,
    verified: this.verified,
    created: this.created,
    updated: this.updated,
    resetToken: this.resetToken,
    verifyToken: this.verifyToken,
    authToken: this.authUserToken(),
  }
}

export default mongoose.model('User', UserSchema)