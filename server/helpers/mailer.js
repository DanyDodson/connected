const nodeMailer = require('nodemailer')
const config = require('config')
const address = config.get('mail.address')
const password = config.get('mail.password')

// const defaultEmailData = { from: 'noreply@seesee.com' }

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
        .then(info => console.log(`Message sent: ${info.response}`))
        .catch(err => console.log(`Problem sending email: ${err}`))
}