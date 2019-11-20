const mongoose = require('mongoose')
const config = require('config')
const image = config.get('user.image')
const secret = config.get('app.secret')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const UserSchema = new mongoose.Schema({
    hash: { type: String },
    salt: { type: String },
    email: { type: String, unique: true },
    image: { type: String, default: image },
    role: { type: String, default: 'user' },
    created: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    info: {
        phones: {
            mobile: { type: String, default: '' },
            work: { type: String, default: '' },
            landline: { type: String, default: '' },
        },
        addresses: [{
            name: { type: String, default: '' },
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            zip: { type: String, default: '' },
        }],
    },
    verifyToken: { data: String, default: '' },
    recoveryToken: { data: String, default: '' },
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

UserSchema.methods.userById = function (id, cb) {
    User.findById(id, cb)
}

UserSchema.methods.generateJWT = function () {
    let today = new Date()
    let exp = new Date(today)
    exp.setDate(today.getDate() + 60)
    return jwt.sign({
        id: this._id,
        email: this.email,
        role: this.role,
        verified: this.verified,
        exp: parseInt(exp.getTime() / 1000),
    }, secret)
}

UserSchema.methods.toAuthJSON = function () {
    return {
        _id: this._id,
        email: this.email,
        image: this.image,
        role: this.role,
        info: this.info,
        created: this.created,
        verified: this.verified,
        verifyToken: this.verifyToken,
        recoveryToken: this.recoveryToken,
        token: this.generateJWT(),
    }
}

mongoose.model('User', UserSchema)