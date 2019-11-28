const config = require('config')
const secret = config.get('app.secret')
const jwt = require('jsonwebtoken')

exports.expMins = (id, iss, username, email) => {
    let today = new Date()
    let exp = new Date(today)
    exp.setMinutes(today.getMinutes() + 10)
    return jwt.sign({
        jti: id,
        iss: iss,
        username: username,
        email: email,
        exp: parseInt(exp.getTime() / 1000),
    }, secret)
}

exports.expHours = (id, iss, username, email) => {
    let today = new Date()
    let exp = new Date(today)
    exp.setHours(today.getHours() + 10)
    return jwt.sign({
        jti: id,
        iss: iss,
        username: username,
        email: email,
        exp: parseInt(exp.getTime() / 1000),
    }, secret)
}

