const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema
const config = require('config')
const secret = config.get('app.secret')
const chars = config.get('shortid.chars')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const uuidv1 = require('uuid/v1')

const UserSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true, index: 1 },
    vToken: { data: String },
    rToken: { data: String },
    role: { type: String, default: 'user' },
    verified: { type: Boolean, default: false },
    salt: String,
    hash: String,
    profile: { type: ObjectId, ref: 'Profile' },
    created: { type: Date, default: Date.now },
    updated: { type: Date },
})

UserSchema.pre('save', function (next) {
    next()
})

UserSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
    return this.hash === hash
}

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex')
}

UserSchema.methods.jwtForUser = function () {
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
        vToken: this.vToken,
        rToken: this.rToken,
        exp: parseInt(exp.getTime() / 1000),
    }, secret)
}

UserSchema.methods.jwtForVerify = (id) => {
    let today = new Date()
    let exp = new Date(today)
    exp.setMinutes(today.getMinutes() + 10)
    return jwt.sign({
        jti: id,
        iss: 'SEESEE_API',
        scope: 'verify email',
        username: this.username,
        getToken: req => { return req.cookies['access_token'] },
        exp: parseInt(exp.getTime() / 1000),
    }, secret)
}

UserSchema.methods.jwtForReset = (id) => {
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
    }, secret)
}

UserSchema.methods.authJson = function () {
    return {
        _id: this._id,
        email: this.email,
        username: this.username,
        profile: this.profile,
        verified: this.verified,
        role: this.role,
        created: this.created,
        updated: this.updated,
        token: this.jwtForUser(),
    }
}

// UserSchema.index({ email: 1, }, { unique: true, })

mongoose.model('User', UserSchema)