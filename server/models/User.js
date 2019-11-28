const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const config = require('config')
const secret = config.get('app.secret')
const chars = config.get('shortid.chars')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    email: { type: String },
    username: { type: String },
    hash: { type: String },
    salt: { type: String },
    roles: { type: [String], default: ["user"] },
    profile: { type: ObjectId, ref: 'Profile' },
    verified: { type: Boolean, default: false },
    verifyToken: { data: String, default: '' },
    recoveryToken: { data: String, default: '' },
    created: { type: Date, default: Date.now },
    updated: { type: Date },
})

UserSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === hash
}

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.generateJWT = function () {
    let today = new Date()
    let exp = new Date(today)
    let iat = new Date(today)
    iat.setHours(today.getHours() + 0)
    exp.setHours(today.getHours() + 2)
    return jwt.sign({
        id: this._id,
        iss: 'seesee',
        iat: parseInt(iat.getTime() / 1000),
        nbf: parseInt(iat.getTime() / 1000),
        jti: this._id,
        email: this.email,
        username: this.username,
        profile: this.profile,
        verified: this.verified,
        roles: this.roles,
        verifyToken: this.verifyToken,
        recoveryToken: this.recoveryToken,
        exp: parseInt(exp.getTime() / 1000),
    }, secret)
}

UserSchema.methods.authJson = function () {
    return {
        _id: this._id,
        email: this.email,
        username: this.username,
        profile: this.profile,
        verified: this.verified,
        roles: this.roles,
        verifyToken: this.verifyToken,
        recoveryToken: this.recoveryToken,
        created: this.created,
        updated: this.updated,
        token: this.generateJWT(),
    }
}

UserSchema.index({ email: 1, }, { unique: true, })

mongoose.model('User', UserSchema)