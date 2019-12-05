const ash = require('express-async-handler')
const nodeMailer = require('nodemailer')
const log = require('../logs/log')
const config = require('config')
const address = config.get('mail.address')
const password = config.get('mail.password')

const mailData = { from: 'SeeSee ❤️ <noreply@seesee.com>' }

exports.sendMail = emailData => {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: { user: address, pass: password }
    })

    return transporter
        .sendMail(emailData)
        .then(info => log.data(`Message sent: ${info.response}`))
        .catch(err => log.data(`Problem sending email: ${err}`))
}

exports.verify = (email, client, token) => {
    return {
        from: mailData.from,
        to: email,
        subject: 'Varify email instructions',
        text: `Please use the following link to verify this email for your account: ${client}/verify${token}`,
        html: `<p>Please use the following link to verify this email for your account:</p> <p>${client}/verify/${token}</p>`
    }
}

exports.verified = (email, client) => {
    return {
        from: mailData.from,
        to: email,
        subject: 'Your account has been verified !',
        text: `Welcome to SeeSee! Create your artist: ${client}/artists/me`,
        html: `<p>Welcome to SeeSee! Create your artist: ${client}/artists/me`
    }
}

exports.forgot = (email, client, token) => {
    return {
        from: mailData.from,
        to: email,
        subject: 'Password Reset Instructions',
        text: `Please use the following link to reset your password: ${client}/forgot/return/${token}`,
        html: `<p>Please use the following link to reset your password: ${client}/forgot/return/${token}</p>`
    }
}

exports.reset = (email, client) => {
    return {
        from: mailData.from,
        to: email,
        subject: 'Your password has been changed !',
        text: `Your password has been changed ! Signin to with your new password ${client}/signin`,
        html: `<p>Your password has been changed ! Signin to with your new password ${client}/signin</p>`
    }
}