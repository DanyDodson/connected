const mongoose = require('mongoose')
const config = require('config')
const secret = config.get('app.secret')

const SessionSchema = new mongoose.Schema({
    jwt: { type: String },
    user_id: { type: String },
})

SessionSchema.methods.generateJWT = function () {
    let today = new Date()
    let exp = new Date(today)
    exp.setDate(today.getDate() + 1)
    return jwt.sign({
        iss: 'seesee',
        iat: parseInt(iat.getTime() / 1000),
        nbf: parseInt(iat.getTime() / 1000),
        jti: this._id,
        exp: parseInt(exp.getTime() / 1000),
    }, secret)
}

SessionSchema.methods.toSession = function () {
    return {
        _id: this._id,
        user_id: this.user_id,
        jwt: this.generateJWT(),
    }
}

mongoose.model('Session', SessionSchema)